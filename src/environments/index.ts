import * as dotenv from 'dotenv'
dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development'

// author
const AUTHOR: string = process.env.AUTHOR || 'HCMUTE'

// couchdb
const COUCH_NAME: string = process.env.COUCH_NAME || 'xxx'
// console.log(APP_NAME)

// application
const NAME: string = process.env.NAME || 'travel'
const PRIMARY_COLOR: string = process.env.PRIMARY_COLOR || '#bae7ff'
const DOMAIN: string = process.env.DOMAIN || 'localhost'
const PORT: number = +process.env.PORT || 14047
const END_POINT: string = process.env.END_POINT || `graphql${NAME}`
const VOYAGER: string = process.env.VOYAGER || 'voyager'
const FE_URL: string = process.env.FE_URL || 'xxx'
const RATE_LIMIT_MAX: number = +process.env.RATE_LIMIT_MAX || 10000
const GRAPHQL_DEPTH_LIMIT: number = +process.env.GRAPHQL_DEPTH_LIMIT || 4

// static
const STATIC: string = process.env.STATIC || 'static'

// mlab
const MLAB_URL: string =
	process.env.MLAB_URL ||
	'mongodb://admin:chnirt1803@ds119663.mlab.com:19663/chnirt-secret'

// mongodb
const MONGO_PORT: number = +process.env.MONGO_PORT || 3000
const MONGO_NAME: string = process.env.MONGO_NAME || NAME
const MONGO_URL: string = `mongodb+srv://abcxyzdev:xdeSOYSbI36HbJ6O@cluster0-yslsh.mongodb.net/travel`

// jsonwebtoken
const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || 'access-token'
const ACCESS_TOKEN_SECRET: string =
	process.env.ACCESS_TOKEN_SECRET || 'abcxyz'
// bcrypt
const SALT: number = +process.env.SALT || 10

// pubsub
const NOTIFICATION_SUBSCRIPTION: string = 'newNotification'
const USER_SUBSCRIPTION: string = 'newUser'
const MESSAGES_SUBSCRIPTION: string = 'newMessages'

export {
	NODE_ENV,
	AUTHOR,
	COUCH_NAME,
	NAME,
	PRIMARY_COLOR,
	DOMAIN,
	PORT,
	END_POINT,
	VOYAGER,
	FE_URL,
	RATE_LIMIT_MAX,
	GRAPHQL_DEPTH_LIMIT,
	STATIC,
	MLAB_URL,
	MONGO_URL,
	MONGO_PORT,
	MONGO_NAME,
	ACCESS_TOKEN,
	ACCESS_TOKEN_SECRET,
	SALT,
	USER_SUBSCRIPTION,
	NOTIFICATION_SUBSCRIPTION,
	MESSAGES_SUBSCRIPTION
}
