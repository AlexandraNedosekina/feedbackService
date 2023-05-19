import styles from './styles.module.sass'

interface IProps {
	children: React.ReactNode
	bulletFilled?: boolean
	lineFilled?: boolean
	position?: 'left' | 'right'
}

const Item = ({
	children,
	bulletFilled = false,
	lineFilled = false,
	position = 'left',
}: IProps) => {
	return (
		<div className={styles.timeline_item}>
			{position === 'right' ? (
				<div className={styles.timeline_item_span}></div>
			) : null}

			<div
				className={styles.timeline_item_content}
				data-line-active={lineFilled}
			>
				{children}

				<div
					className={styles.timeline_bullet}
					data-active={bulletFilled}
				></div>
			</div>

			{position === 'left' ? (
				<div className={styles.timeline_item_span}></div>
			) : null}
		</div>
	)
}

export default Item
