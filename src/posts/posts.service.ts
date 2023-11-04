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


    async getAllPosts(){
        return this.postsRepository.find() ;
    };

    async getPostById(id : number){
        const post = await this.postsRepository.findOne({
            where : {
                id, //id : id, where id = ${id}와 같은 의미
            },
        });

        if(!post) throw new NotFoundException;

        return post;
    };

    async createPost(author : string, title : string, content : string){
    
        // create()는 저장소와 연결이 아닌 객체만 생성이기 때문에 동기이다.
        const post = this.postsRepository.create({
            author,
            title,
            content,
            likeCount : 0,
            commentCount : 0
        });

        if(!author || !title || !content) throw new NotFoundException;

        const newPost = await this.postsRepository.save(post);

        return newPost;
    };

    async updatePost(id : number, author : string, title : string, content : string){

        const findPost = await this.postsRepository.findOne({
            where : {
                id
            },
        });

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

       const newPost = await this.postsRepository.save(findPost);

        return newPost;
    };

    async deletePost(id : number){
        const findPost = await this.postsRepository.findOne({
            where : {
                id
            },
        });

        if(!findPost) throw new NotFoundException;

        const deletePost = await this.postsRepository.delete(findPost);

        return id;
    }
}
