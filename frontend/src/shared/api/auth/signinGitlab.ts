import api from '..'
import { errorHandler } from '../errorHandler'

async function signinGitlab() {
	try {
		const res = await api.get<{ authorize_url: string }>(
			'/auth/signin-gitlab'
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default signinGitlab
