import { sign, verify } from 'jsonwebtoken'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core'

import { User as UserEntity, Account as AccountEntity } from '@models'
import { LoginResponse } from '../../generator/graphql.schema'

import { ACCESS_TOKEN_SECRET } from '@environments'

/**
 * Returns access token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The access token mean of `user`
 *
 * @beta
 */
export const generateToken = async (
	account: AccountEntity
): Promise<string> => {
	return sign(
		{
			subject: account._id
		},
		ACCESS_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '30d' // 15m
		}
	)
}

/**
 * Returns login response by trade token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The login response mean of `user`
 *
 * @beta
 */
export const tradeToken = async (
	account: AccountEntity
): Promise<LoginResponse> => {
	const accessToken = await generateToken(account)

	return { accessToken }
}

/**
 * Returns user by verify token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param token - 1st input number
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyToken = async (token: string): Promise<UserEntity> => {
	let currentUser

	await verify(token, ACCESS_TOKEN_SECRET!, async (err, data) => {
		if (err) {
			throw new AuthenticationError(
				'Authentication token is invalid, please try again.'
			)
		}

		// currentUser = await getMongoRepository(UserEntity).findOne({
		// 	idAccount: data.subject
		// })
		// console.log(data.subject)
		currentUser = (await getMongoRepository(UserEntity).aggregate([
			{
				$lookup: {
					from: 'account',
					localField: 'idAccount',
					foreignField: '_id',
					as: 'account'
				}
			},
			{
				$unwind: "$account"
			},
			{
				$match: {
					"account._id": data.subject
				}
			}
		]).toArray())[0]
		// console.log('currentUser', currentUser)
		if (!currentUser) {
			throw new AuthenticationError(
				'Authentication token is invalid, please try again.'
			)
		}
	})

	return currentUser
}
