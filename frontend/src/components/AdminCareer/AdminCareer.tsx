import { UserSearchSelect } from '@components/UserSearchSelect'
import { Container, Title } from '@mantine/core'

const AdminCareer = () => {
	return (
		<Container pt="lg">
			<Title order={2}>Карьерный рост</Title>

			<UserSearchSelect />
		</Container>
	)
}

export default AdminCareer
