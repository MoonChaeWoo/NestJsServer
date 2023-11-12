import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService : JwtService,
        private readonly usersService : UsersService
    ){}

    /**
     * 토큰을 사용하게 되는 방식
     * 
     * 1) 사용자가 로그인 또는 회원가입을 진행하면
     *     accessToken과 refreshToken을 발급받는다.
     * 
     * 2) 로그인 할 때는 Basic 토큰과 함께 요청을 보낸다.
     *    Basic 토큰은 '이메일:비밀번호'를 Base64로 인코딩한 형태이다.
     *      예) {authorization : 'Basic {token}'}
     * 
     * 3) 아무나 접근할 수 없는 정보(private route)를 접근 할 때는
     *      accessToken을 Header에 추가해서 요청과 함께 보낸다.
     *      예) {authorization : 'Bearer {token}'}
     * 
     * 4) 토큰과 요청을 함께 받은 서버는 검증을 통해 현재 요청을 보냄
     *     사용자는 누구인지 알 수 있다.
     *      예를 들어 현재 로그인한 사용자가 작성한 포스트만 필터링 할 수 있다.
     *      특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
     * 
     * 5) 모든 토큰은 만료기간이 있다. 만료기간이 지나면 새로 토큰을 발급바당야한다.
     *      그렇지 않으면 jwtService.vertify()에서 인증이 통과 안된다.
     *      그러니 access 토큰을 새로 발급 받을 수 있는 /auth/token/access와
     *      refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요하다.
     * 
     * 6) 토큰이 만료되면 각각의 토큰을 새로 받급 받을 수 있는 엔드포인트에 요청으 ㄹ해서 
     *      새로운 토큰을 받을 수 있는 /auth/token/refresh가 필요하다.
     */

    
    /**
     * Header로 부터 토큰을 받을 때
     * 
     * {authorization : 'Basic {token}'}
     * {authorization : 'Bearer {token}'}
     */
    extractTokenFromHeader(header : string, isBearer : boolean){
        // 'Basic {token}'
        // ['Basic, {token}']
        const splitToken = header.split(' ');

        const prefix = isBearer ? 'Bearer' : 'Basic';

        if(splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰입니다.');
        };

        const token = splitToken[1];

        return token;
    }

    /**
     * Basuc asldkjf;alsdkjfasdfas 이러한 토큰 형태를 
     * 
     * 1. email:password형태로 변경
     * 2. email:password -> [email, password]형태로 변경
     * 3. {email, password}형태로 반환
     */
    decodeBasicToken(base64String : string){
        // Buffer.from()는 node에서 기본적으로 제공해줌
        const decoded = Buffer.from(base64String, 'base64').toString('utf8');

        const split = decoded.split(':');

        if(split.length !== 2) throw new UnauthorizedException('잘못된 유형의 토큰입니다.');

        return {
            email : split[0],
            password : split[1]
        };
    };

    /**
     * 토큰 검정
     * @param token 
     * @returns 
     */
    verifyToken(token : string){
        return this.jwtService.verify(token, {
            secret : JWT_SECRET,
        });
    };

    rotateToken(token : string, isRefreshToken : boolean){
        const decoded = this.verifyToken(token);
         /**
         * sub : id
         * email : email
         * type : 'access'  | 'refresh'
         */
         if(decoded.type !== 'refresh'){
            throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다.');
        };

        return this.signToken({
            ...decoded,
        }, isRefreshToken);
    }

    /**
     * 1) registerWithEmail
     *      - email, nickname, password를 입력받고 사용자 생성
     *      - 생성이 완료되면 accessToken과 refreshTocken을 반환한다.
     *      - 회원가입 후 다시 로그인 방지하는 기능 생성
     * 
     * 2) loginWithEmail
     *      - email, password를 입력하면 사용자 검증 진행
     *      - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
     * 
     * 3) loginUser
     *      - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직
     * 
     * 4) signToken
     *      - (3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
     * 
     * 5) authenticateWithEmailAndPassword
     *      - loginWithEmail(2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행
     *          - 1. 사용자가 존재하는지 확인 (email)
     *          - 2. 비밀번호가 맞는지 확인
     *          - 3. 모두 통과되면 찾은 사용자 정보 반환
     *          - 4. loginWithEmail(2)에서 반환된 데이터를 기반으로 토큰 생성
     * 
     */

    /**
     * Payload에 들어갈 정보 예시
     * 
     * 1) email
     * 2) sub -> id
     * 3) type : 'access' | 'refresh'
     */
    signToken(user : Pick<UsersModel, 'email' | 'id'>, isRefreshToken : boolean){
        const payload = {
            email : user.email,
            sub : user.id,
            type : isRefreshToken ? 'refresh' : 'access'
        };

        return this.jwtService.sign(payload, {
            secret : JWT_SECRET,
            // 초 단위
            // Refresh토큰은 길게 access 토큰은 짧게
            expiresIn : isRefreshToken ? 3600 : 300, 
        });
    };

    async loginUser(user : Pick<UsersModel, 'email' | 'id'>){
        return {
            accessToken : this.signToken(user, false),
            refreshToken : this.signToken(user, true)
        }
    };

    async authenticateWithEmailAndPassword(user : Pick<UsersModel, 'email' | 'password'>){
        const existUser = await this.usersService.getUserByEmail(user.email);

        if(!existUser) throw new UnauthorizedException('존재하지 않는 사용자입니다');

        /**
         * 
         * 비밀번호 비교
         * 파라미터
         * 
         * 1) 입력된 비밀번호
         * 2) 기존 해쉬 -> 사용자 정보에 저장돼있는 해쉬
         */
        const passCheck = await bcrypt.compare(user.password, existUser.password);

        if(!passCheck){
            throw new UnauthorizedException('비밀번호가 틀렸습니다');
        }

        return existUser;
    };

    async loginWithEmail(user : Pick<UsersModel, 'email' | 'password'>){
        const existUser = await this.authenticateWithEmailAndPassword(user);

        return this.loginUser(existUser);
    };

    async registerWithEmail(user : Pick<UsersModel, 'email' | 'nickname' | 'password'>){
        // 비밀번호 해시 생성하는 기능
        // (해싱할 패스워드, 해시 라운드)
        // 솔트는 자동으로 해줌
        const hash = await bcrypt.hash(
            user.password,
            HASH_ROUNDS,
        );

        const newUser = await this.usersService.createUser({...user, password : hash});

        return this.loginUser(newUser);
    }
}
