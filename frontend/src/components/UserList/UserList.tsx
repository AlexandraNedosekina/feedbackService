import BottomGradientList from '@components/BottomGradientList'
import Search from '@components/SearchBar'
import UserButton from '@components/UserButton'
import { Flex, ScrollArea, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import { getFeedbackList, QueryKeys } from 'shared/api'

interface Props {}

const UserList: FC<Props> = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const {
		query: { feedbackId },
	} = useRouter()

	const { data: feedbackList, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK_LIST],
		queryFn: getFeedbackList,
	})
	const filteredFeedbackList = useMemo(
		() =>
			feedbackList?.filter(feedback =>
				feedback.receiver.full_name
					.toLowerCase()
					.includes(searchValue.trim().toLowerCase())
			),
		[feedbackList, searchValue]
	)

	if (isLoading) {
		// TODO loading skeleton
		return <p>Загрузка...</p>
	}

	return (
		<Flex direction={'column'} h={'100%'}>
			<Search value={searchValue} onChange={setSearchValue} />
			<ScrollArea
				mt="md"
				bg="white"
				h={'100%'}
				sx={() => ({
					borderRadius: '4px',
					position: 'relative',
				})}
			>
				{filteredFeedbackList && !!searchValue.trim() ? (
					filteredFeedbackList.map(feedback => (
						<UserButton
							key={feedback.id}
							avatarUrl={
								feedback?.receiver?.avatar?.thumbnail_url || null
							}
							name={feedback.receiver.full_name}
							post={feedback.receiver.job_title || ''}
							href={String(feedback.id)}
							isActive={+(feedbackId as string) === feedback.id}
							isCompleted={feedback.completed}
						/>
					))
				) : feedbackList && feedbackList.length > 0 ? (
					feedbackList.map(feedback => (
						<UserButton
							key={feedback.id}
							avatarUrl={
								feedback?.receiver?.avatar?.thumbnail_url || null
							}
							name={feedback.receiver.full_name}
							post={feedback.receiver.job_title || ''}
							href={String(feedback.id)}
							isActive={+(feedbackId as string) === feedback.id}
							isCompleted={feedback.completed}
						/>
					))
				) : (
					<Text p="sm">Нет сотрудников для оценки</Text>
				)}

				<BottomGradientList />
			</ScrollArea>
		</Flex>
	)
}

export default UserList
