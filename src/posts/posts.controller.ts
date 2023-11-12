import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModel } from './entities/post.entity';
// GET
// 1) GET /posts
//    모든 값을 가져온다.

// 2) GET /posts/:id
//    id에 해당되는 post를 가져온다.

// POST
// 1) POST /posts
//    POST를 생성한다.

// PUT
// 1) id에 해당되는 POST를 변경또는 생성한다.

// DELETE /posts/:id
//  1) id에 해당되는 POST를 삭제한다.

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get() // 아무것도 넣지 않는다면 /와 같은 의미
  getPosts() : Promise<PostModel[]>{
    return this.postsService.getAllPosts();
  };

  // GET /posts/:id/:name/:age
  // http://127.0.0.1:3000/posts/1
  // @Query()를 사용하면  http://127.0.0.1:3000/posts?id=1이렇게 가능
  // @Param('id') 이렇게 하면 id에 해당하는 쿼리스트링을 가져온다.
  // 자세하게는 파라미터 규칙.txt확인

  // @Param('id') id : string)
  // url은 기본적으로 문자형으로만 받을 수 있음 
  // 하지만 (@Param('id', ParseIntPipe) id : number) 이렇게 사용시
  // 문자형을 숫자형으로 변형해서 메소드 파라미터로 넘겨주기에 number로 타입 설정 가능
  // 타입을 변형도 시켜주며 검증도 해주는게 파이프이다.
  @Get(':id') 
  getPost(@Param('id', ParseIntPipe) id : number) : Promise<PostModel>{
    return this.postsService.getPostById(id);
  };

  // POST /posts
  //      POST를 생성
  @Post()
  postPosts(
    @Body('authorId') authorId : number,
    @Body('title') title : string,
    @Body('content') content : string
  ) : Promise<PostModel>{
    return this.postsService.createPost(authorId, title, content);
  };

  // 파라미터 단에서도 선택적으로 하려면 ?를 작성해줘야한다.
  @Put(':id')
  putPost(
    @Param('id', ParseIntPipe) id : number,
    @Body('title') title ?: string,
    @Body('content') content ?: string
  ) : Promise<PostModel> {
    return this.postsService.updatePost(id, title, content);
  };

  // DELETE /posts/:id
  //        id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id : number) : Promise<number>{
    return this.postsService.deletePost(id);
  };
}
