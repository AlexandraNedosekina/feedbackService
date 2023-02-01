import { useQuery } from '@tanstack/react-query'
import { getUser, QueryKeys, TUserAdapter } from 'shared/api'

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
