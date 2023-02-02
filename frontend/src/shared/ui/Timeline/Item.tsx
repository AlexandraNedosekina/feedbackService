import styles from './styles.module.sass'

interface IProps {
	children: React.ReactNode
	isCurrent: boolean
	position?: 'left' | 'right'
}

const Item = ({ children, isCurrent, position = 'left' }: IProps) => {
	return (
		<div className={styles.timeline_item}>
			{position === 'right' ? (
				<div className={styles.timeline_item_span}></div>
			) : null}

			<div
				className={styles.timeline_item_content}
				data-line-active={isCurrent}
			>
				{children}

				<div
					className={styles.timeline_bullet}
					data-active={isCurrent}
				></div>
			</div>

			{position === 'left' ? (
				<div className={styles.timeline_item_span}></div>
			) : null}
		</div>
	)
}

export default Item
