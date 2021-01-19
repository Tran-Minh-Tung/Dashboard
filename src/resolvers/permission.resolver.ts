import { Permission } from './../generator/graphql.schema';
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Permission as PermissionEntity } from '@models'

@Resolver('Permission')
export class PermissionResolver {
  @Query()
  async permissions(): Promise<Permission []> {
    const allPermission = await getMongoRepository(PermissionEntity).find({})
    return allPermission
  }
}
