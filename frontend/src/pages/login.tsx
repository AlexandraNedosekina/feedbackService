import { Container, Button, Title, Center } from '@mantine/core'
import Link from 'next/link'

const LoginPage = () => {
	return (
		<>
			<Container>
				<Title>Вход</Title>
			</Container>
			<Center>
				<Link href="https://git.66bit.ru/users/sign_in" passHref>
					<Button component="a">Войти через Git</Button>
				</Link>
			</Center>
		</>
	)
}

export default LoginPage
