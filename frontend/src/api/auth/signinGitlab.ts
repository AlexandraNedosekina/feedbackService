import api from '..'

async function signinGitlab() {
	try {
		const res = await api.get<{ authorize_url: string }>(
			'/auth/signin-gitlab'
		)

		return res.data
	} catch (error: any) {
		console.error(error)

		throw new Error(error)
	}
}

export default signinGitlab
