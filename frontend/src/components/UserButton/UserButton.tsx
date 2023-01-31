import Icon from '@components/Icon'
import { Avatar, Text, Title } from '@mantine/core'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './UserButton.module.sass'

interface UserButtonProps {
	avatarUrl: string | null
	name: string
	post: string
	href: string
	isActive: boolean
	isCompleted: boolean
}

export default function UserButton({
	avatarUrl,
	name,
	post,
	href,
	isActive,
	isCompleted,
}: UserButtonProps) {
	return (
		<Link
			className={classNames(styles.root, {
				[styles.active]: isActive,
			})}
			href={`/feedback/${href}`}
		>
			<Avatar src={avatarUrl} radius="xl" size={'lg'} />
			<div style={{ flex: 1 }}>
				<Title order={4} color="brand.5">
					{name}
				</Title>

				<Text color="brand.4" size={14} weight={500}>
					{/* {post} */}
					Backend
				</Text>
			</div>

			{isCompleted && (
				<div className={styles.done}>
					<Icon icon="done" size={22} />
				</div>
			)}
		</Link>
	)
}
