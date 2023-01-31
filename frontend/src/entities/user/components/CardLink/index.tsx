import { Icon } from 'shared/ui'
import classNames from 'classnames'
import Link from 'next/link'
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
			{isCompleted ? (
				<div className={styles.done}>
					<Icon icon="done" size={22} />
				</div>
			) : null}
		</Link>
	)
}

export default UserLinkCard
