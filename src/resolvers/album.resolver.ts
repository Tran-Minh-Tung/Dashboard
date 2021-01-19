import { Album, Image } from './../generator/graphql.schema'
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context, Parent, ResolveProperty } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Album as AlbumEntity, Image as ImageEntity } from '@models'

@Resolver('Album')
export class AlbumResolver {
  @Query()
  async album(@Args('_id') _id: string): Promise<Album> {
    const existAlbum = await getMongoRepository(AlbumEntity).findOne({ _id })
    return existAlbum
  }

  @Query()
  async albumsByUser(@Args('_id') _id: string): Promise<Album[]> {
    const existAlbum = await getMongoRepository(AlbumEntity).find({ idUser: _id })
    return existAlbum
  }

  @Mutation()
  async createAlbum (@Args('name') name: string, @Context('currentUser') currentUser): Promise<Album> {
    const album = await getMongoRepository(AlbumEntity).save(new AlbumEntity({ name, idUser: currentUser._id }))
    return album
  }

  @Mutation()
  async deleteAlbum (@Args('_id') _id: string): Promise<boolean> {
    const album = await getMongoRepository(AlbumEntity).deleteOne({ _id })
    return !!album
  }

  @Mutation()
  async addImage (@Args('_id') _id: string, @Args('imageUrl') imageUrl: string): Promise<Album> {
    const image = await getMongoRepository(ImageEntity).save(new ImageEntity({ url: imageUrl }))
    const existAlbum = await getMongoRepository(AlbumEntity).findOne({ _id })
    if (existAlbum) {
      existAlbum.idImage.push(image._id)
      const newAlbum = await getMongoRepository(AlbumEntity).save(new AlbumEntity({ ...existAlbum }))
      console.log(newAlbum)
      return newAlbum
    }

    throw new ApolloError('Album not found', '404')
  }

  @Mutation()
  async addMultiImage (@Args('_id') _id: string, @Args('imageUrls') imageUrls: string[]): Promise<Album> {
    const imageObj = imageUrls.map(url => new ImageEntity({ url }))
    const images = await getMongoRepository(ImageEntity).insertMany(imageObj)

    const existAlbum = await getMongoRepository(AlbumEntity).findOne({ _id })
    if (existAlbum) {
      const arrImageIds = Object.keys(images.insertedIds).map(key => images.insertedIds[key])
      existAlbum.idImage = [...existAlbum.idImage, ...arrImageIds]
      const newAlbum = await getMongoRepository(AlbumEntity).save(new AlbumEntity({ ...existAlbum }))
      return newAlbum
    }

    throw new ApolloError('Album not found', '404')
  }

  @Mutation()
  async removeImage (@Args('_id') _id: string, @Args('idImage') idImage: string): Promise<boolean> {
    const existAlbum = await getMongoRepository(AlbumEntity).findOne({ _id })
    if (existAlbum) {
      const index = existAlbum.idImage.indexOf(idImage)
      if (index > -1 ) {
        existAlbum.idImage.splice(index, 1)
      }
      const newAlbum = await getMongoRepository(AlbumEntity).save(new AlbumEntity({ ...existAlbum }))
      return !!newAlbum
    }

    throw new ApolloError('Album not found', '404')
  }

  @ResolveProperty()
  async images (@Parent() album) {
    const { idImage } = album
    const allImage = await getMongoRepository(ImageEntity).find({
      where: {
        _id: {
          $in: idImage
        }
      }
    })
    return allImage
  }
}
