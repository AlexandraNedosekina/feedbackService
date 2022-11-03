async function authorizeGitlab(code: string, state: string) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/authorize-gitlab?code=${code}&state=${state}`,
			{
				method: 'GET',
				credentials: 'include',
			}
		)
		const data = await res.json()
		console.log(data)

		if (res.status !== 200 || data.status_code !== 200) {
			throw new Error(data.detail || 'Something went wrong')
		}

		return data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default authorizeGitlab
