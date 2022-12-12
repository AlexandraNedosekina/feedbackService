import Icon from '@components/Icon'
import { ActionIcon, Group, Title } from '@mantine/core'
import { FC, useState } from 'react'
import AddColleaguesModal from './AddColleaguesModal'

const ColleaguesTitle: FC = () => {
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
			/>
		</>
	)
}

export default ColleaguesTitle
