import { Status } from './../generator/graphql.schema';
import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'post',
  orderBy: {
    publishedAt: 'DESC'
  }
})
export class Post {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  title: string

  @Expose()
  @Column()
  titleStr: string      // tiêu đề ko dấu

  @Expose()
  @Column()
  content: string

  @Expose()
  @Column()
  contentStr: string    // nội dung không dấu

  @Expose()
  @Column()
  summary: string

  @Expose()
  @Column()
  imageUrlPost: string

  @Expose()
  @Column()
  tags: string[]

  @Expose()
  @Column()
  status: Status

  @Expose()
  @Column()
  reason: string

  @Expose()
  @Column()
  publishedAt: number

  @Expose()
  @Column()
  createdBy: string

  @Expose()
  @Column()
  likedBy: string[]

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(post: Partial<Post>) {
    if (post) {
      Object.assign(
        this,
        plainToClass(Post, post, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.title = this.title || ''
      this.titleStr = this.titleStr || ''
      this.content = this.content || ''
      this.contentStr = this.contentStr || ''
      this.summary = this.summary || ''
      this.imageUrlPost = this.imageUrlPost || ''
      this.tags = this.tags || []
      this.status = this.status || Status.WAIT_APPROVE
      this.reason = this.reason || ''
      this.createdBy = this.createdBy || ''
      this.likedBy = this.likedBy || []
      this.publishedAt = +new Date() || 0
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
