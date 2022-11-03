import axios from 'axios'

const axiosApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
})

export default axiosApi
