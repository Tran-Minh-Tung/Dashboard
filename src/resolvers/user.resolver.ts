import { CreateUserInput, UpdateUserInput } from './../generator/graphql.schema'
import { Resolver, Mutation, Args, ResolveProperty, Parent, Context, Query } from '@nestjs/graphql'
import { getMongoRepository, getRepository } from 'typeorm'
import { Account as AccountEntity, User as UserEntity, Report as ReportEntity } from '@models'
import { tradeToken } from '../auth'
import { LoginResponse, LoginUserInput, UserResponse } from 'generator/graphql.schema'
import { AuthenticationError, ApolloError } from 'apollo-server-express'
import { comparePassword, hashPassword } from '@utils'

const aggPipeline = [
  {
    $lookup: {
      from: 'account',
      localField: 'idAccount',
      foreignField: '_id',
      as: 'account'
    }
  },
  {
    $unwind: {
      path: '$account',
    }
  }
]

@Resolver('UserResponse')
export class UserResolver {
  @Query()
  async users (@Args('limit') limit: number, @Args('offset') offset: number, @Args('keyword') keyword: string): Promise<UserResponse[]> {
    const allUser = await getMongoRepository(UserEntity).aggregate([
      ...aggPipeline,
      {
        $match: {
          'account.username': { $ne: 'admin' },
          name: { $regex: !!keyword ? keyword : `` }
        }
      },
      {
        $skip: offset
      },
      {
        $limit: limit
      }
    ]).toArray()

    return allUser
  }

  @Query()
  async numberOfUsers(@Args('keyword') keyword: string): Promise<number> {
    const allUser = await getMongoRepository(UserEntity).aggregate([
      ...aggPipeline,
      {
        $match: {
          'account.username': { $ne: 'admin' },
          name: { $regex: !!keyword ? keyword : `` }
        }
      }
    ]).toArray()
    return allUser.length
  }

  @Query()
  async user(@Args('_id') _id: string): Promise<UserResponse> {
    const existUser = await getMongoRepository(UserEntity).aggregate([
      ...aggPipeline,
      {
        $match: {
          _id
        }
      }
    ]).toArray()

    if(existUser && existUser[0]) {
      return existUser[0]
    }

    throw new ApolloError('User not found', '404')
  }

  @Query()
  async me (@Context('currentUser') currentUser): Promise<UserResponse> {
    return currentUser
  }

  @Query()
  async userHighestPost (): Promise<UserResponse[]> {
    const allUser = await getMongoRepository(UserEntity).aggregate([
      {
        $lookup: {
          from: 'post',
          localField: '_id',
          foreignField: 'createdBy',
          as: 'posts'
        }
      },
      {
        $project: {
          name: 1,
          imageUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          numberOfPost: { $cond: { if: { $isArray: '$posts' }, then: { $size: '$posts' }, else: '0'} }
       }
      },
      {
        $sort: {
          numberOfPost: -1
        }
      },
      {
        $limit: 10
      }
    ]).toArray()
    return allUser
  }

	@Mutation()
	async login(@Args('input') input: LoginUserInput): Promise<LoginResponse> {
    const { FBID, username, password } = input
    if (FBID) {
      const account = await getMongoRepository(AccountEntity).findOne({ FBID })
      if(!account) {
        throw new ApolloError('Account not exist', '404')
      }

      if (account.isLocked) {
        throw new ApolloError('Account is locked', '423')
      }

      return tradeToken(account)
    }

    const account =  await getMongoRepository(AccountEntity).findOne({ username })

    if (account.isLocked) {
      throw new ApolloError('Account is locked', '423')
    }

    if(account && (await comparePassword(password, account.password))) {
      return tradeToken(account)
    }

    throw new AuthenticationError('Login failed.')
  }
  
  @Mutation()
	async register(@Args('input') input: CreateUserInput): Promise<Boolean> {
    const accountInput = { FBID: input.FBID, username: input.username, password: input.password }
    if (accountInput.password) {
      accountInput.password = await hashPassword(accountInput.password)
    }

    if(accountInput.username) {
      const existAccount = await getMongoRepository(AccountEntity).findOne({ username: accountInput.username })
      if (existAccount) {
        throw new ApolloError ('Username has exist already', '409')
      }
    }
    
    const newAccount = await getMongoRepository(AccountEntity).save(new AccountEntity(accountInput))
    if (newAccount) {
      const userInput = { ...input, idAccount: newAccount._id }

      delete userInput.FBID
      delete userInput.password
      delete userInput.username

      const newUser = await getMongoRepository(UserEntity).save(new UserEntity(userInput))
      return !!newUser
    }

    throw new ApolloError('Create user failed', '417')
  }

  @Mutation()
  async followAndUnfollow(@Args('_id') _id: string, @Context('currentUser') currentUser): Promise<Boolean> {
    const existUser = await getMongoRepository(UserEntity).findOne({ _id })
    
    if(!existUser) {
      throw new ApolloError('User not found', '404')
    }

    const index = existUser.followingBy.indexOf(currentUser._id)
    if (index >-1) {
      existUser.followingBy.splice(index, 1)
    } else {
      existUser.followingBy.push(currentUser._id)
    }
    const newUser = await getMongoRepository(UserEntity).save(new UserEntity(existUser))
    return !!newUser
  }

  @Mutation()
  async createUser (@Args('input') input: CreateUserInput): Promise<UserResponse> {
    const accountInput = { FBID: input.FBID, username: input.username, password: input.password, permissions: input.permissions }
    if (accountInput.password) {
      accountInput.password = await hashPassword(accountInput.password)
    }

    if(accountInput.username) {
      const existAccount = await getMongoRepository(AccountEntity).findOne({ username: accountInput.username })
      if (existAccount) {
        throw new ApolloError ('Username has exist already', '409')
      }
    }
    
    const newAccount = await getMongoRepository(AccountEntity).save(new AccountEntity(accountInput))
    if (newAccount) {
      const userInput = { ...input, idAccount: newAccount._id }

      delete userInput.FBID
      delete userInput.password
      delete userInput.username

      const newUser = await getMongoRepository(UserEntity).save(new UserEntity(userInput))
      return { ...newUser, account: newAccount }
    }

    throw new ApolloError('Create user failed', '417')
  }

  @Mutation()
  async updateUser(@Args('_id')_id: string, @Args('input') input: UpdateUserInput, @Context('currentUser') currentUser): Promise<UserResponse> {
    const user = _id ? (await getMongoRepository(UserEntity).findOne({ _id })) : (await getMongoRepository(UserEntity).findOne({ _id: currentUser._id }))
    user.name = input.name
    user.address = input.address
    user.birthday = input.birthday
    user.email = input.email
    user.description = input.description
    user.gender = input.gender
    const newUser = await getMongoRepository(UserEntity).save(new UserEntity(user))
    return newUser
  }

  @Mutation()
  async updateAvatar (url: string, @Context('currentUser') currentUser): Promise<Boolean> {
    const user = await getMongoRepository(UserEntity).findOne({ _id: currentUser._id })
    user.imageUrl = url
    const newUser = await getMongoRepository(UserEntity).save(new UserEntity(user))
    return !!newUser
  }

  @ResolveProperty()
  async followers (@Parent() user) {
    const { followingBy } = user
    const allFollower = await getMongoRepository(UserEntity).find({
      where: {
        _id: {
          $in: followingBy
        }
      }
    })
    return allFollower
  }

  @ResolveProperty()
  async account (@Parent() user) {
    const { idAccount } = user
    const acc = await getMongoRepository(AccountEntity).findOne({ _id: idAccount })
    return acc
  }

  @ResolveProperty()
  async numberOfReport (@Parent() user) {
    const { _id } = user
    const num = await getMongoRepository(ReportEntity).count({
      idTarget: _id
    })
    return num
  }
}
