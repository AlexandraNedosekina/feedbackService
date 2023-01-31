import { Icon } from 'shared/ui'
import { ActionIcon, Group, Title } from '@mantine/core'
import { useState } from 'react'
import AddColleaguesModal from './AddColleaguesModal'

interface IProps {
	userId: string
}

const ColleaguesTitle = ({ userId }: IProps) => {
	const [isModalOpened, setIsModalOpened] = useState(false)

	return (
		<>
			<Group mb="sm" spacing={'xs'}>
				<Title order={3}>Коллеги</Title>

				<ActionIcon
					variant="light"
					color="brand.6"
					onClick={() => setIsModalOpened(true)}
				>
					<Icon icon="add" />
				</ActionIcon>
			</Group>

			<AddColleaguesModal
				opened={isModalOpened}
				onClose={() => setIsModalOpened(false)}
				userId={userId}
			/>
		</>
	)
}

export default ColleaguesTitle
