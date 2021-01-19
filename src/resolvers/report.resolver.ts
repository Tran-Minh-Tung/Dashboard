import { Report, ReportInput } from './../generator/graphql.schema';
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context, ResolveProperty, Parent } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Report as ReportEntity, User as UserEntity, Post as PostEntity } from '@models'

@Resolver('Report')
export class ReportResolver {
  @Query()
  async report(@Args('idTarget') idTarget: string):Promise<Report[]> {
    const allReport = await getMongoRepository(ReportEntity).aggregate([
      {
        $match: {
          idTarget
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]).toArray()
    return allReport
  }
  
  @Query()
  async reportByType(@Args('type') type: string):Promise<Report[]> {
    const allReport = await getMongoRepository(ReportEntity).aggregate([
      {
        $match:{
          type
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]).toArray()
    return allReport
  }

  @Mutation()
  async createReport(@Args('input') input: ReportInput, @Context('currentUser') currentUser): Promise<boolean> {
    const newReport = await getMongoRepository(ReportEntity).save(new ReportEntity({ ...input, idUser: currentUser._id }))
    return !!newReport
  }

  @ResolveProperty()
  async reportedBy (@Parent() report) {
    const { idUser } = report
    const user = await getMongoRepository(UserEntity).findOne({ _id: idUser })
    return user
  }

  @ResolveProperty()
  async target (@Parent() report) {
    const { idTarget, type } = report
    if (type === 'POST') {
      const post = await getMongoRepository(PostEntity).findOne({ _id: idTarget})
      return { _id: post._id, name: post.title }
    }

    if (type === 'USER') {
      const user = await getMongoRepository(UserEntity).findOne({ _id: idTarget })
      return { _id: user._id, name: user.name }
    }
  }
}
