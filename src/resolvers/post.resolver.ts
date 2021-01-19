import { HistoryResolver } from './history.resolver';
import { PostResponse, PostInput, Status, Statistical, HistoryAction, HistoryType } from './../generator/graphql.schema'
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context, ResolveProperty, Parent } from '@nestjs/graphql'
import { getMongoRepository, getRepository } from 'typeorm'
import { Post as PostEntity, Report as ReportEntity } from '@models'
import * as diacritic from 'diacritic'

const aggPipeline = [
  {
    $lookup: {
      from: 'user',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy'
    }
  },
  {
    $unwind: '$createdBy'
  },
  {
    $lookup: {
      from: 'user',
      localField: 'likedBy',
      foreignField: '_id',
      as: 'likedBy'
    }
  }
]

@Resolver('PostResponse')
export class PostResolver {
  @Query()
  async posts(
    @Args('status') status: string, 
    @Args('tags') tags: string,
    @Args('keyword') keyword: string,
    @Args('limit') limit: number, 
    @Args('offset') offset: number
  ): Promise<PostResponse[]> {
    const conditions = tags ? {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      status,
      tags: diacritic.clean(tags).toLowerCase()
    } : {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      status
    }

    const allPost = await getMongoRepository(PostEntity).aggregate([
      ...aggPipeline,
      {
        $match: {
          ...conditions
        }
      },
      {
        $sort: {
          publishedAt: -1
        }
      },
      {
        $skip: offset
      },
      {
        $limit: limit
      }
    ]).toArray()
    return allPost
  }

  @Query()
  async postsByUser(
    @Args('_id') _id: string,
    @Args('status') status: Status, 
    @Args('tags') tags: string,
    @Args('keyword') keyword: string,
    @Args('limit') limit: number, 
    @Args('offset') offset: number
  ): Promise<PostResponse[]> {
    const conditions = tags ? {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      createdBy: _id,
      status,
      tags: diacritic.clean(tags).toLowerCase()
    } : {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      createdBy: _id,
      status,
    }

    const allPost = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          ...conditions
        }
      },
      ...aggPipeline,
      {
        $sort: {
          publishedAt: -1
        }
      },
      {
        $skip: offset
      },
      {
        $limit: limit
      }
    ]).toArray()
    return allPost
  }

  @Query()
  async post(@Args('_id') _id: string): Promise<PostResponse> {
    const allPost = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          _id
        }
      },
      ...aggPipeline
    ]).toArray()

    if (allPost && allPost.length > 0) {
      return allPost[0]
    }

    throw new ApolloError('Post not found', '404')

  }

  @Query()
  async numberOfPosts(@Args('status') status: string, @Args('tags') tags: string, @Args('keyword') keyword: string): Promise<number> {
    const conditions = tags ? {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      status,
      tags: diacritic.clean(tags).toLowerCase()

    } : {
      $or: [
        { titleStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
        { contentStr: { $regex: !!keyword ? diacritic.clean(keyword).toLowerCase() : `` } },
      ],
      status
    }

    const allPost = await getMongoRepository(PostEntity).aggregate([
      ...aggPipeline,
      {
        $match: {
          ...conditions
        }
      }
    ]).toArray()
    return allPost.length
  }

  @Query()
  async numberOfPostByUser (@Args('_id') _id: string): Promise<number> {
    const numbers = await getMongoRepository(PostEntity).count({ 
        createdBy: _id
    })

     return numbers
  }

  @Query()
  async statisticalPost (@Args('_id') _id: string): Promise<Statistical []> {
    let data = null
    if (_id) {
      data = await getMongoRepository(PostEntity).aggregate([
        {
          $match: {
            createdBy: _id
          }
        },
        { 
          $project: {
            count: 1,
            month: { '$month': {'$toDate' : '$publishedAt'} }
          }
        }, 
        { 
          $group: {
            '_id': '$month', 
            'count': { '$sum': 1 }
          }
        }
      ]).toArray()
    } else {
      data = await getMongoRepository(PostEntity).aggregate([
        { 
          $project: {
            count: 1,
            month: { '$month': {'$toDate' : '$publishedAt'} }
          }
        }, 
        { 
          $group: {
            '_id': '$month', 
            'count': { '$sum': 1 }
          }
        }
      ]).toArray()
    }
    return data
  }

  @Query()
  async statisticalStatusPost (): Promise<Statistical []> {
    const data = await getMongoRepository(PostEntity).aggregate([
      { 
        $project: {
          count: 1,
          status: 1
        }
      }, 
      { 
        $group: {
          '_id': '$status', 
          'count': { '$sum': 1 }
        }
      }
    ]).toArray()
    return data
  }

  @Mutation()
  async createPost(@Args('input') input: PostInput, @Context('currentUser') currentUser): Promise<Boolean> {
    const titleStr = diacritic.clean(input.title).toLowerCase()
    const contentStr = diacritic.clean(input.content).toLowerCase()

    const newPost = await getMongoRepository(PostEntity).save(new PostEntity({ ...input, titleStr, contentStr, createdBy: currentUser._id }))
    return !!newPost
  }

  @Mutation()
  async updatePost(@Args('_id') _id: string, @Args('input') input: PostInput): Promise<Boolean> {
    const existPost = await getRepository(PostEntity).findOne({ _id })

    if (existPost) {
      const titleStr = diacritic.clean(input.title).toLowerCase()
      const contentStr = diacritic.clean(input.content).toLowerCase()

      const post = { ...existPost, ...input, titleStr, contentStr }
      const updatePost = await getMongoRepository(PostEntity).save(new PostEntity(post))
      return !!updatePost
    }

    throw new ApolloError('Post not found', '404')
  }

  @Mutation()
  async lockAndUnlockPost(@Args('_id') _id: string, @Args('reason') reason: string, @Context('currentUser') currentUser): Promise<Boolean> {
    const existPost = await getRepository(PostEntity).findOne({ _id })

    if (existPost) {
      existPost.status = existPost.status === Status.LOCKED ? Status.PUBLISHED : Status.LOCKED
      existPost.reason = reason
      const updatePost = await getMongoRepository(PostEntity).save(new PostEntity(existPost))
      HistoryResolver.addHistory(
        HistoryType.POST,
        existPost.status === Status.LOCKED ? HistoryAction.LOCK : HistoryAction.UNLOCK,
        currentUser._id,
        {
          _id: existPost._id,
          name: existPost.title
        }
      )
      return !!updatePost
    }

    throw new ApolloError('Post not found', '404')
  }

  @Mutation()
  async likeAndUnlikePost(@Args('_id') _id: string, @Context('currentUser') currentUser): Promise<Boolean> {
    const post = await getRepository(PostEntity).findOne({ _id })
    if (post) {
      const index = post.likedBy.indexOf(currentUser._id)
      if (index > -1) {
        post.likedBy.splice(index, 1)
      } else {
        post.likedBy.push(currentUser._id)
      }
      const updatePost = await getRepository(PostEntity).save(new PostEntity(post))
      return !!updatePost
    }

    throw new ApolloError('Post not found', '404')
  }

  @Mutation()
  async approvePost (@Args('_id') _id: string, @Context('currentUser') currentUser): Promise<Boolean> {
    const existPost = await getMongoRepository(PostEntity).findOne({ _id })
    if (existPost) {
      if (existPost.status === Status.WAIT_APPROVE) {
        existPost.status = Status.PUBLISHED
        const updatePost = await getMongoRepository(PostEntity).save(new PostEntity({ ...existPost, publishedAt: +new Date()}))
        HistoryResolver.addHistory(
          HistoryType.POST,
          HistoryAction.APPROVE,
          currentUser._id,
          {
            _id: existPost._id,
            name: existPost.title
          }
        )
        return !!updatePost
      }
      throw new ApolloError ('ForbiddenError', '403')
    }

    throw new ApolloError('Post not found', '404')
  }

  @ResolveProperty()
  async numberOfReport (@Parent() post) {
    const { _id } = post
    const num = await getMongoRepository(ReportEntity).count({
      idTarget: _id
    })
    return num
  }
}
