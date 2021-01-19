import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'permission',
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Permission {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  code: string

  @Expose()
  @Column()
  name: string

  constructor(permission: Partial<Permission>) {
    if (permission) {
      Object.assign(
        this,
        plainToClass(Permission, permission, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuidv1()
      this.code = this.code || ''
      this.name = this.name || ''
    }
  }
}
