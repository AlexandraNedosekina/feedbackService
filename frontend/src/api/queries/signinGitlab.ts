import api from '..'

async function signinGitlab() {
	try {
		const res = await api.get('/auth/signin-gitlab', {
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:8000',
				'Access-Control-Allow-Credentials': 'true',
			},
		})
		console.log(res)

		return res.data
	} catch (error: any) {
		console.error(error)

		throw new Error(error)
	}
}

export default signinGitlab
