import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id : number;
  author : string;
  title : string;
  content : string;
  likeCount : number;
  commentCount : number;
};

let posts : PostModel[] = [{
  id : 1,
  author : 'authorPost1',
  title : 'titlePost',
  content : 'contentsPost',
  likeCount : 10,
  commentCount : 10
},{
  id : 2,
  author : 'authorPost2',
  title : 'titlePost',
  content : 'contentsPost',
  likeCount : 11,
  commentCount : 11
},{
  id : 3,
  author : 'authorPost3',
  title : 'titlePost',
  content : 'contentsPost',
  likeCount : 12,
  commentCount : 12
}];

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
  getPosts() : PostModel[]{
    return posts;
  }

  // GET /posts/:id/:name/:age
  // http://127.0.0.1:3000/posts/1
  // @Param('id') 이렇게 하면 id에 해당하는 쿼리스트링을 가져온다.
  // 자세하게는 파라미터 규칙.txt확인
  @Get(':id') 
  getPost(@Param('id') id : string) : PostModel{
    const post = posts.find(v => v.id === +id);

    if(!post){
      throw new NotFoundException;
    }
    return post;
  }

  // POST /posts
  //      POST를 생성
  @Post()
  postPosts(
    @Body('author') author : string,
    @Body('title') title : string,
    @Body('content') content : string
  ) : PostModel{
    const post : PostModel = {
      id : posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount : 0,
      commentCount : 0,
    };

    if(!author || !title || !content) throw new NotFoundException;

    posts = [...posts, post];

    return post;
  }
}
