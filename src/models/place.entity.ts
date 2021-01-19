import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'place',
  orderBy: {
    createdAt: 'ASC'
  }
})
export class Place {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  name: string

  @Expose()
  @Column()
  idUser: string

  @Expose()
  @Column()
  description: string

  @Expose()
  @Column()
  idAlbum: string[]

  @Expose()
  @Column()
  startAt: number

  @Expose()
  @Column()
  endAt: number

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(place: Partial<Place>) {
    if (place) {
      Object.assign(
        this,
        plainToClass(Place, place, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuid.v1()
      this.name = this.name || ''
      this.idUser = this.idUser || ''
      this.description = this.description || ''
      this.idAlbum = this.idAlbum || []
      this.startAt = this.startAt || 0
      this.endAt = this.endAt || 0
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
