import axios from 'axios'
import router from 'next/router'

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const axiosApi = axios.create({
	baseURL,
	withCredentials: true,
})

let refreshRetryCount = 0

axiosApi.interceptors.response.use(
	response => response,
	error => {
		const { response, config } = error

		const isUnauthorized = response?.status === 401
		const isRefresh = config.url === '/auth/refresh'
		const isPublicPage = ['/'].includes(router.pathname)

		if (isUnauthorized && !isRefresh && !isPublicPage) {
			if (refreshRetryCount < 3) {
				refreshRetryCount++
				return axiosApi
					.get('/auth/refresh')
					.then(() => {
						return axiosApi(config)
					})
					.catch(() => {
						return Promise.reject(error)
					})
			} else {
				document.cookie =
					'access-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
				document.cookie =
					'refresh-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
				router.push('/')
			}
		}

		return Promise.reject(error)
	}
)

export default axiosApi
