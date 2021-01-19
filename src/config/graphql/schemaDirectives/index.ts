import { createRateLimitDirective } from 'graphql-rate-limit'
import AuthDirective from './auth'
import PermissionDirective from './permission'

export default {
	isAuthenticated: AuthDirective,
	hasPermission: PermissionDirective,
	// length: LengthDirective,
	rateLimit: createRateLimitDirective({
		identifyContext: ctx => (ctx.currentUser && ctx.currentUser._id) || ''
	})
}
