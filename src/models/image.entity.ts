import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'image',
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Image {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  url: string

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(image: Partial<Image>) {
    if (image) {
      Object.assign(
        this,
        plainToClass(Image, image, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.url = this.url || ''
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
