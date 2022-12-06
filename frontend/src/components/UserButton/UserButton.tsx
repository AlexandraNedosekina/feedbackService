import { Avatar, Text, Title } from '@mantine/core'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './UserButton.module.sass'

interface UserButtonProps {
	recieverId: number
	name: string
	post: string
	href: string
	isActive: boolean
}

export default function UserButton({
	recieverId,
	name,
	post,
	href,
	isActive,
}: UserButtonProps) {
	return (
		<Link
			className={classNames(styles.root, {
				[styles.active]: isActive,
			})}
			href={`/feedback/${href}`}
		>
			<Avatar
				src={
					recieverId
						? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${recieverId}/avatar`
						: null
				}
				radius="xl"
				size={'lg'}
			/>
			<div style={{ flex: 1 }}>
				<Title order={4} color="brand.6">
					{name}
				</Title>

				<Text color="black" size={14}>
					{post}
				</Text>
			</div>
		</Link>
	)
}
