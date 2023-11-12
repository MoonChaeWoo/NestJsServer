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

@Injectable()
export class MaxLengthPipe implements PipeTransform{
    constructor(private readonly length : number,
                private readonly subject : string){}

    transform(value: any, metadata: ArgumentMetadata) {
        if(value.toString().length > this.length){
            throw new BadRequestException(`${this.subject} 최대 길이는 ${this.length}자 입니다.`);
        };
        return value.toString();
    }
}

@Injectable()
export class MinLengthPipe implements PipeTransform{
    constructor(private readonly length : number,
                private readonly subject : string){}

    transform(value: any, metadata: ArgumentMetadata) {
        if(value.toString().length < this.length){
            throw new BadRequestException(`${this.subject} 최소 길이는 ${this.length}자 입니다.`);
        };
        return value.toString();
    }
    
}