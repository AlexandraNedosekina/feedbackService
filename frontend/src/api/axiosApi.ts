import axios from 'axios'

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const axiosApi = axios.create({
	baseURL,
	withCredentials: true,
})

axiosApi.interceptors.response.use(
	response => response,
	error => {
		const { response, config } = error

		if (response.status !== 401) {
			return Promise.reject(error)
		}

		return axios
			.get('/auth/refresh', {
				baseURL,
				withCredentials: true,
			})
			.then(() => {
				return axiosApi(config)
			})
			.catch(() => {
				return Promise.reject(error)
			})
	}
)

export default axiosApi
