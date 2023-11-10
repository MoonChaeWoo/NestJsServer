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
