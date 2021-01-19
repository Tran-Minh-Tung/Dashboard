import { HistoryType, HistoryAction } from './../generator/graphql.schema';
import { HistoryResolver } from './history.resolver';
import { ApolloError } from 'apollo-server-express'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Account as AccountEntity, User as UserEntity } from '@models'
import { comparePassword, hashPassword } from '@utils'

@Resolver('Account')
export class AccountResolver {
	@Query()
	async accounts(): Promise<AccountEntity[]> {
		const accounts = await getMongoRepository(AccountEntity).find({
			where: { username: { $ne: 'admin' } }
		})
		return accounts
	}

	@Mutation()
	async lockAndUnlockAccount(@Args('_id') _id: string, @Args('reason') reason: string, @Context('currentUser') currentUser): Promise<Boolean> {
		const account = await getMongoRepository(AccountEntity).findOne({ _id })
		if(!account) {
			throw new ApolloError('Account not found', '404')
		}
		const user = await getMongoRepository(UserEntity).findOne({ idAccount: _id })
		account.isLocked = !account.isLocked
		const newAccount = await getMongoRepository(AccountEntity).save(new AccountEntity(account))
		HistoryResolver.addHistory(
			HistoryType.USER,
			account.isLocked ? HistoryAction.LOCK : HistoryAction.UNLOCK,
			currentUser._id,
			{
				_id: user._id,
				name: account.username || user.name
			}
		)
		return !!newAccount
	}

	@Mutation()
	async changePassword(@Args('oldPassword') oldPassword: string, @Args('newPassword') newPasword: string, @Context('currentUser') currentUser): Promise<Boolean> {
		const account = await getMongoRepository(AccountEntity).findOne({ _id: currentUser.idAccount })
		if(account && (await comparePassword(oldPassword, account.password))) {
			account.password = await hashPassword(newPasword)
			const newAccount = await getMongoRepository(AccountEntity).save(new AccountEntity(account))
			return !!newAccount
		}
		
		throw new ApolloError('Account not found', '404')
	}

	@Mutation()
	async changePermissions(@Args('_id') _id: string, @Args('permissions') permissions: string[]): Promise<boolean> {
		const account = await getMongoRepository(AccountEntity).findOne({ _id })
		if(account) {
			account.permissions = permissions
			const newAccount = await getMongoRepository(AccountEntity).save(new AccountEntity(account))
			return !!newAccount
		}
		
		throw new ApolloError('Account not found', '404')
	}
}
