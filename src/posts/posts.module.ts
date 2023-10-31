import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// nest g resource
@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
