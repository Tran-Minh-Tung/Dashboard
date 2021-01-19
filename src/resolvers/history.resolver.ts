import { History, HistoryType, HistoryAction, HistoryContent } from './../generator/graphql.schema';
import { Resolver, Query, Mutation, Args, Context, ResolveProperty, Parent } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { History as HistoryEntity, User as UserEntity } from '@models'

@Resolver('History')
export class HistoryResolver {
	@Query()
	async history(): Promise<History []> {
		const history = await getMongoRepository(HistoryEntity).aggregate([
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()
		return history
  }
  
  static async addHistory(type: HistoryType, action: HistoryAction, idUser: string, content: HistoryContent): Promise<boolean> {
    const addHistory = await getMongoRepository(HistoryEntity).save(new HistoryEntity({ type, action, idUser, content }))
    return !!addHistory
  }

  @ResolveProperty()
  async actionBy (@Parent() history) {
    const { idUser } = history
    const user = await getMongoRepository(UserEntity).findOne({ _id: idUser })
    return user
  }
}
