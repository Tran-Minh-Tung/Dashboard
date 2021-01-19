import { Comment, CommentInput } from './../generator/graphql.schema'
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context, ResolveProperty, Parent } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Comment as CommentEntity, User as UserEntity } from '@models'

@Resolver('Comment')
export class CommentResolver {
  @Query()
  async comments(@Args('idPost') idPost: string, @Args('limit') limit: number, @Args('offset') offset: number): Promise<Comment []> {
    const comments = await getMongoRepository(CommentEntity).find({
      where: {
        idPost
      },
      order: {
        createdAt: -1
      },
      skip: offset,
      take: limit
     })
    return comments
  }

  @Mutation()
  async createComment(@Args('input') input: CommentInput, @Context('currentUser') currentUser): Promise<Comment> {
    const newComment = await getMongoRepository(CommentEntity).save(new CommentEntity({ ...input, idUser: currentUser._id }))
    return newComment
  }

  @Mutation()
  async updateComment(@Args('_id') _id: string, @Args('input') input: CommentInput): Promise<Comment> {
    const existComment = await getMongoRepository(CommentEntity).findOne({ _id })
    if(existComment) {
      const updateComment = await getMongoRepository(CommentEntity).save(new CommentEntity({ ...existComment, ...input }))
      return updateComment
    }

    throw new ApolloError('Comment not found', '404')
  }

  @Mutation()
  async deleteComment(@Args('_id') _id: string): Promise<boolean> {
    const existComment = await getMongoRepository(CommentEntity).findOne({ _id })
    if(existComment) {
      const updateComment = await getMongoRepository(CommentEntity).deleteOne({ _id })
      return !!updateComment
    }

    throw new ApolloError('Comment not found', '404')
  }

  @ResolveProperty()
  async commentBy (@Parent() comment) {
    const { idUser } = comment
    const user = await getMongoRepository(UserEntity).findOne({ _id: idUser })
    return user
  }
}
