import { useQuery } from '@tanstack/react-query'
import { getUser, QueryKeys } from 'src/api'
import { User } from 'src/api/generatedTypes'

export const useUser = () => {
	const { data, isLoading, isError, isFetching } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: getUser,
	})

	return {
		user: data as User,
		isLoading,
		isError,
		isFetching,
	}
}
