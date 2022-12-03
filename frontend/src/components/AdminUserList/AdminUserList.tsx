import BottomGradientList from '@components/BottomGradientList'
import Search from '@components/SearchBar'
import UserButton from '@components/UserButton'
import { Flex, ScrollArea } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { QueryKeys } from 'src/api'
import getFeedbackByEventId from 'src/api/feedback/getFeedbackByEventId'

const users = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 4,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 5,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 6,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 7,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 8,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 9,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 10,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 11,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
]

interface Props {}

const UserList: FC<Props> = () => {
	const {
		query: { feedbackId },
	} = useRouter()

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK_LIST_EVENT, 1],
		queryFn: () => getFeedbackByEventId(1),
	})

	if (isLoading) {
		// TODO loading skeleton
		return <p>Загрузка...</p>
	}

	return (
		<Flex direction={'column'} h={'100%'}>
			<Search />
			<ScrollArea
				mt="md"
				bg="white"
				h={'100%'}
				sx={() => ({
					borderRadius: '4px',
					position: 'relative',
				})}
			>
				{data &&
					data.map(feedback => (
						<UserButton
							key={feedback.id}
							image={feedback.image}
							name={feedback.name}
							post={feedback.email}
							href={String(feedback.id)}
							isActive={+(feedbackId as string) === feedback.id}
						/>
					))}

				<BottomGradientList />
			</ScrollArea>
		</Flex>
	)
}

export default UserList
