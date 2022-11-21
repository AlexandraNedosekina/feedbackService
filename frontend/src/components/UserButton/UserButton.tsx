import {
	Avatar,
	createStyles,
	Group,
	Text,
	Title,
	UnstyledButton,
	UnstyledButtonProps,
} from '@mantine/core'
import { useRouter } from 'next/router'

const useStyles = createStyles((theme, params: { isActive: boolean }) => ({
	user: {
		width: '100%',
		padding: theme.spacing.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		backgroundColor: params.isActive ? theme.colors.brand[1] : theme.white,
		borderRadius: '4px',

		'&:hover': {
			backgroundColor: params.isActive ? undefined : theme.colors.brand[1],
		},
	},
}))

interface UserButtonProps extends UnstyledButtonProps {
	image: string
	name: string
	post: string
	userId: number
	isActive: boolean
}

export default function UserButton({
	image,
	name,
	post,
	userId,
	isActive,
	...others
}: UserButtonProps) {
	const { classes } = useStyles({ isActive })

	const router = useRouter()

	function goToUser() {
		router.push(`/feedback/${userId}`)
	}

	return (
		<UnstyledButton className={classes.user} {...others} onClick={goToUser}>
			<Group>
				<Avatar src={image} radius="xl" size={'lg'} />
				<div style={{ flex: 1 }}>
					<Title order={4} color="brand.5">
						{name}
					</Title>

					<Text color="brand.4" size={14}>
						{post}
					</Text>
				</div>
			</Group>
		</UnstyledButton>
	)
}
