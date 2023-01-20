import { AxiosError } from 'axios'
import { HTTPValidationError } from './generatedTypes'

/**
 * @throws {Error}
 */
export const errorHandler = (error: any): never => {
	if (error instanceof AxiosError) {
		const errorData = error.response?.data
		if (httpValidationErrorGuard(errorData)) {
			if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
				throw new Error(errorData.detail[0].msg, {
					cause: { code: error.response?.status || 500 },
				})
			}

			// @ts-expect-error ignoring due to api types error (parsedError.detail cannot be string but it can)
			throw new Error(errorData.detail, {
				cause: { code: error.response?.status || 500 },
			})
		}

		throw new Error(error.message, {
			cause: { code: error.response?.status || 500 },
		})
	}

	throw new Error(error?.message || 'Unknown error')
}

const httpValidationErrorGuard = (data: any): data is HTTPValidationError => {
	return data?.detail
}
