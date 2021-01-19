import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'album',
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Album {
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
  idImage: string[]

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(album: Partial<Album>) {
    if (album) {
      Object.assign(
        this,
        plainToClass(Album, album, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.name = this.name || ''
      this.idUser = this.idUser || ''
      this.idImage = this.idImage || []
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
