import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'comment',
  orderBy: {
    createdAt: 'ASC'
  }
})
export class Comment {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  idUser: string

  @Expose()
  @Column()
  idPost: string

  @Expose()
  @Column()
  content: string

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(comment: Partial<Comment>) {
    if (comment) {
      Object.assign(
        this,
        plainToClass(Comment, comment, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.idUser = this.idUser || ''
      this.idPost = this.idPost || ''
      this.content = this.content || ''
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
