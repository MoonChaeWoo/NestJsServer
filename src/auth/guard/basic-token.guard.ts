/**
 * 구현할 기능
 * 
 * 1) 요청객체 (Request)를 불러오고
 *    authorization header로부터 토큰을 가져온다.
 * 
 * 2) authService.extractTokenFromHeader를 이용해서 
 *     사용 할 수 있는 형태의 토큰을 추출한다.
 * 
 * 3) authService.decodeBasicToken을 실행해서
 *    email과 password를 추출한다.
 * 
 * 4) email과 password를 이용해서 사용자를 가져온다.
 *    authService.authenticateWithEmailAndPassword
 * 
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
 *    req.user = user;
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate{
    constructor(private readonly authService : AuthService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // context 요청 객체 == 요청객체 (Request)
        const req = context.switchToHttp().getRequest();

        // {Authorization : 'Basic asdfasdfasdfasdf'}
        // rawToken = Basic asdfasdfasdfasdf
        const rawToken = req.headers['Authorization'];

        if(!rawToken){
            throw new UnauthorizedException('권한이 없습니다');
        }

        //Basic asdfasdfasdfasdf에서 asdfasdfasdfasdf만 추출
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const {email, password} = this.authService.decodeBasicToken(token);

        const user = await this.authService.authenticateWithEmailAndPassword({
            email,
            password
        })

        req.user = user;

        return true;
    }

}