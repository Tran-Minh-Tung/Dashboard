import { Image } from './../generator/graphql.schema'
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Image as ImageEntity } from '@models'

@Resolver('Image')
export class ImageResolver {
  @Query()
  async images(): Promise<Image []> {
    const images = await getMongoRepository(ImageEntity).find({})
    return images
  }

  @Mutation()
  async createImage (@Args('url') url: string): Promise<boolean> {
    const image = await getMongoRepository(ImageEntity).save(new ImageEntity({ url }))
    return !!image
  }
}
