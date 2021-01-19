import { Place, CreatePlaceInput, UpdatePlaceInput, Album } from './../generator/graphql.schema';
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context, ResolveProperty, Parent } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Place as PlaceEntity, User as UserEntity, Album as AlbumEntity } from '@models'

@Resolver('Place')
export class PlaceResolver {
  @Query()
  async placesByUser(@Args('_id') _id: string): Promise<Place []> {
    const places = await getMongoRepository(PlaceEntity).find({ idUser: _id })
    return places
  }

  @Query()
  async numberOfPlace(@Args('_id') _id: string): Promise<number> {
    const numbers = await getMongoRepository(PlaceEntity).count({ 
        idUser: _id
    })

     return numbers
  }

  @Mutation()
  async createPlace (@Args('input') input: CreatePlaceInput, @Context('currentUser') currentUser): Promise<boolean> {
    const existPlace = await getMongoRepository(PlaceEntity).findOne({ name: input.name, idUser: currentUser._id })
    if (existPlace) {
      throw new ApolloError ('Place has exist already', '409')
    }

    const createdPlace = await getMongoRepository(PlaceEntity).save(new PlaceEntity({ ...input, idUser: currentUser._id }))
    return !!createdPlace
  }

  @Mutation()
  async updatePlace (@Args('_id') _id: string, @Args('input') input: UpdatePlaceInput): Promise<boolean> {
    const existPlace = await getMongoRepository(PlaceEntity).findOne({ _id })

    if (existPlace) {
      const updatePlace = await getMongoRepository(PlaceEntity).save (new PlaceEntity({ ...existPlace, ...input }))
      return !!updatePlace
    }

    throw new ApolloError('Place not found', '404')
  }
  
  @Mutation()
  async deletePlace (@Args('_id') _id: string): Promise<boolean> {
    const existPlace = await getMongoRepository(PlaceEntity).findOne({ _id })

    if (existPlace) {
      const deletePlace = await getMongoRepository(PlaceEntity).deleteOne({ _id })
      return !!deletePlace
    }

    throw new ApolloError('Place not found', '404')
  }

  @Mutation()
  async addAlbum (@Args('_id') _id: string, @Args('albumName') albumName: string, @Context('currentUser') currentUser): Promise<Place> {
    console.log(_id)
    const existPlace = await getMongoRepository(PlaceEntity).findOne({ _id })

    if (existPlace) {
      const album = await getMongoRepository(AlbumEntity).save(new AlbumEntity({ name: albumName, idUser: currentUser._id }))
      existPlace.idAlbum.push(album._id)
      const place = await getMongoRepository(PlaceEntity).save(new PlaceEntity(existPlace))
      return place
    }

    throw new ApolloError('Place not found', '404')
  }

  @Mutation()
  async removeAlbum (@Args('_id') _id: string, @Args('idAlbum') idAlbum: string): Promise<boolean> {
    console.log(_id)
    const existPlace = await getMongoRepository(PlaceEntity).findOne({ _id })

    if (existPlace) {
      const index = existPlace.idAlbum.indexOf(idAlbum)
      existPlace.idAlbum.splice(index, 1)
      const place = await getMongoRepository(PlaceEntity).save(new PlaceEntity(existPlace))
      return !!place
    }

    throw new ApolloError('Place not found', '404')
  }

  @ResolveProperty()
  async createdBy (@Parent() place) {
    const { idUser } = place
    const userResponse = await getMongoRepository(UserEntity).find({
      _id: idUser
    })
    return userResponse
  }

  @ResolveProperty()
  async albums (@Parent() place) {
    const { idAlbum } = place
    console.log(idAlbum)
    const allAlbum = await getMongoRepository(AlbumEntity).find({
      where: {
        _id: {
          $in: idAlbum
        }
      }
    })
    return allAlbum
  }
}
