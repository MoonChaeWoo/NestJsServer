import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'

@Injectable()
export class PasswordPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        // value 
        // pipe로 들어온 값


        // ArgumentMetadata 타입 정의

        // @Body('email') email : string,
        //readonly type: Paramtype;
        // -> @Body, @Query, @Param, or custom parameter
        // -> @Body() 이 부분을 말함

        //readonly metatype?: Type<any> | undefined;
        // email : string 여기에서 string이걸 가리킴

        //readonly data?: string | undefined;
        // @Body('email') 여기세어 email이 data를 가리킴

        if(value.toString().length < 9){
            throw new BadRequestException('비밀번호는 9자 이상으로 입력하세요');
        }

        return value.toString();
    }
    
}