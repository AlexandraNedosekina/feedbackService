import { Text } from '@mantine/core'
import { Container, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useUser } from 'entities/user'
import { getMyCareer, QueryKeys } from 'shared/api'
import { CareerTimeline } from 'widgets/career-timeline'

export default () => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER],
		queryFn: getMyCareer,
	})
	const { user } = useUser()

	return (
		<Container pt="lg">
			<Title order={2}>Карьерный рост</Title>

			{user?.job_title && (
				<Title order={4} color="brand" mt="md">
					{user.job_title}
				</Title>
			)}

			{isLoading && <Text mt="md">Загрузка...</Text>}

			{data && data?.length === 0 ? (
				<Text mt="md">
					На данный момент у вас нет карьерного плана. Обратитесь к
					руководителю.
				</Text>
			) : data && data?.length > 0 ? (
				<CareerTimeline data={data} />
			) : null}
		</Container>
	)
}
