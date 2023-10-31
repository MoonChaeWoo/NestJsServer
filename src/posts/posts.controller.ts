import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

interface Post {
  author : string;
  title : string;
  contents : string;
  likeCount : number;
  commentCount : number;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  post:Post = {
    author : 'authorPost',
    title : 'titlePost',
    contents : 'contentsPost',
    likeCount : 10,
    commentCount : 10
  };

  @Get() // 아무것도 넣지 않는다면 /와 같은 의미
  getPost() : Post{
    return this.post;
  }
}
