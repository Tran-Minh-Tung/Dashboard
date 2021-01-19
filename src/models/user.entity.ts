import { UserResponse } from 'generator/graphql.schema';
import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: `user`,
	orderBy: {
		createdAt: 'ASC'
	}
})
export class User {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
  idAccount: string
  
  @Expose()
	@Column()
  followingBy: string[]

	@Expose()
	@Column()
	name: string
	
	@Expose()
	@Column()
  gender: string

  @Expose()
	@Column()
	birthday: number

	@Expose()
	@Column()
	address: string

	@Expose()
	@Column()
	email: string

	@Expose()
	@Column()
	imageUrl: string

	@Expose()
	@Column()
	description: string

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	updatedAt: number

	constructor(user: Partial<User>) {
		if (user) {
			Object.assign(
				this,
				plainToClass(User, user, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.idAccount = this.idAccount || ''
			this.name = this.name || ''
			this.gender = this.gender || ''
			this.followingBy = this.followingBy || []
			this.birthday = this.birthday || null
			this.address = this.address || ''
			this.email = this.email || ''
			this.imageUrl = this.imageUrl || ''
			this.description = this.description || ''
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
