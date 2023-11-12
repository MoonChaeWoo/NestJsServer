import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  async postTokenAccess(
    @Headers('Authorization') rawtoken : string
  ){
    const token = this.authService.extractTokenFromHeader(rawtoken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken : newToken
    };
  };

  @Post('token/refresh')
  async postTokenRefresh(
    @Headers('Authorization') rawtoken : string
  ){
    const token = this.authService.extractTokenFromHeader(rawtoken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken : newToken
    };
  };


  @Post('login/email')
  PostLoginEmail(
    @Headers('Authorization') rawToken : string,
  ){
    // email:password -> base64
    // asdklfjaskldfa;sdkf -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  };

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname : string,
    @Body('email') email : string,
    @Body('password', new MaxLengthPipe(20, '비밀번호'),
                      new MinLengthPipe(9, '비밀번호')) password : string
  ){
    return this.authService.registerWithEmail({email, nickname, password});
  }

}
