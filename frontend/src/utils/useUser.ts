import { useQuery } from '@tanstack/react-query'
import { getUser, QueryKeys } from 'src/api'
import { TUserAdapter } from 'src/api/adapters/getUserAdapter'

export const useUser = () => {
	const { data, isLoading, isError, isFetching } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: getUser,
	})

	return {
		user: data as TUserAdapter,
		isLoading,
		isError,
		isFetching,
	}
}
