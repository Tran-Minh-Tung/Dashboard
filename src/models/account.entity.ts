import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'account',
  orderBy: {
    createdAt: 'ASC'
  }
})
export class Account {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  FBID: string

  @Expose()
  @Column()
  username: string

  @Expose()
  @Column()
  password: string

  @Expose()
  @Column()
  isLocked: boolean

  @Expose()
  @Column()
  reason: string

  @Expose()
  @Column()
  permissions: string[]

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  updatedAt: number

  constructor(account: Partial<Account>) {
    if (account) {
      Object.assign(
        this,
        plainToClass(Account, account, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuid.v1()
      this.FBID = this.FBID || ''
      this.username = this.username || ''
      this.password = this.password || ''
      this.isLocked = this.isLocked || false
      this.reason = this.reason || ''
      this.permissions = this.permissions || []
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
