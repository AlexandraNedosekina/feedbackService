import { Badge, SimpleGrid } from '@mantine/core'
import classNames from 'classnames'
import Link from 'next/link'
import { Icon } from 'shared/ui'
import UserInfoCard from '../Card'
import styles from './styles.module.sass'

interface IProps {
	avatarUrl: string | null
	name: string
	jobTitle: string
	href: string
	isActive: boolean
	isCompleted: boolean
}

const UserLinkCard = ({
	avatarUrl,
	href,
	isActive,
	isCompleted,
	jobTitle,
	name,
}: IProps) => {
	return (
		<Link
			href={`/feedback/${href}`}
			className={classNames(styles.root, {
				[styles.active]: isActive,
			})}
		>
			<UserInfoCard
				name={name}
				jobTitle={jobTitle}
				avatar={avatarUrl || ''}
				variant="sm"
			/>
			<SimpleGrid cols={1}>
				<div className={styles.done}>
					{isCompleted ? <Icon icon="done" size={22} /> : null}
				</div>
				<Badge
					color="brand"
					size="md"
					sx={() => ({
						placeSelf: 'end',
					})}
				>
					Event name
				</Badge>
			</SimpleGrid>
		</Link>
	)
}

export default UserLinkCard
