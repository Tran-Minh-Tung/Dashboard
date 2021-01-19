import { HistoryAction, HistoryContent, HistoryType } from './../generator/graphql.schema';
import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'history',
  orderBy: {
    createdAt: 'ASC'
  }
})

export class History {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  type: HistoryType  //POST or USER

  @Expose()
  @Column()
  action: HistoryAction

  @Expose()
  @Column()
  idUser: string // ID USER

  @Expose()
  @Column(type => HistoryContent)
  content: HistoryContent

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(history: Partial<History>) {
    if (history) {
      Object.assign(
        this,
        plainToClass(History, history, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuid.v1()
      this.type = this.type || null
      this.action = this.action || null
      this.idUser = this.idUser || ''
      this.content = this.content || null
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
