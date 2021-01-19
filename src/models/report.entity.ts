import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'report',
  orderBy: {
    createdAt: 'ASC'
  }
})
export class Report {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  idUser: string

  @Expose()
  @Column()
  type: string

  @Expose()
  @Column()
  content: string

  @Expose()
  @Column()
  idTarget: string

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(report: Partial<Report>) {
    if (report) {
      Object.assign(
        this,
        plainToClass(Report, report, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.idUser = this.idUser || ''
      this.type = this.type || ''
      this.content = this.content || ''
      this.idTarget = this.idTarget || ''
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
