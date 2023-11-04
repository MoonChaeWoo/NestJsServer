import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entities';
import { InjectRepository } from '@nestjs/typeorm';
  
@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postsRepository: Repository<PostModel>
    ){}


    getAllPosts(){
        return posts; 
    };

    getPostById(id : number){
        const post = posts.find(v => v.id === id);

        if(!post){
            throw new NotFoundException;
        }

        return post;
    };

    createPost(author : string, title : string, content : string){
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
    };

    updatePost(id : number, author : string, title : string, content : string){
        const findPost = posts.find(v => v.id === id);

        if(!findPost) throw new NotFoundException;

        if(author){
            findPost.author = author;
        }

        if(title){
            findPost.title = title;
        }

        if(content){
            findPost.content = content;
        }

        posts = posts.map(v => v.id === +id ? findPost : v);

        return findPost;
    };

    deletePost(id : number){
        const post = posts.find(v => v.id === id);
        if(!post) throw new NotFoundException;

        posts = posts.filter(v => v.id !== +id);
        return id;
    }
}
