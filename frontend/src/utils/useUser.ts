import { useQuery } from '@tanstack/react-query'
import { getUser, QueryKeys } from 'src/api'
import { User } from 'src/api/generatedTypes'

export const useUser = (): User => {
	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: getUser,
	})

	if (!data) {
		throw new Error('User not found')
	}

	return data
}
