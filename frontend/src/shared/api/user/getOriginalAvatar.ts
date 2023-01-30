import { baseURL } from '../axiosApi'

async function getOriginalAvatar(userId: number): Promise<string> {
	return new Promise(res => res(`${baseURL}/user/${userId}/avatar/original`))
}

export default getOriginalAvatar
