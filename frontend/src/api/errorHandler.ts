import { AxiosError } from 'axios'
import { HTTPValidationError } from './generatedTypes'

export const errorHandler = (error: any): string => {
	if (error instanceof AxiosError) {
		if (httpValidationErrorGuard(error.response?.data)) {
			const parsedError = error.response?.data as HTTPValidationError

			if (
				Array.isArray(parsedError.detail) &&
				parsedError.detail.length > 0
			) {
				return parsedError.detail[0].msg
			}

			// ignoring due to api types error (parsedError.detail cannot be string but it can)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return parsedError.detail
		}

		return error.message
	}

	return error
}

const httpValidationErrorGuard = (error: any): error is HTTPValidationError => {
	return error?.detail
}
