import { baseURL } from '../axiosApi'

async function getAvatarThumbnail(userId: number) {
	return new Promise(res => res(`${baseURL}/user/${userId}/avatar`))
}

export default getAvatarThumbnail
