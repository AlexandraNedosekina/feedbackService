import { Container, Title } from '@mantine/core'
import { AdminCareer } from 'widgets/admin-career'

export default () => {
	return (
		<Container pt="lg">
			<Title order={2}>Карьерный рост</Title>

			<AdminCareer />
		</Container>
	)
}
