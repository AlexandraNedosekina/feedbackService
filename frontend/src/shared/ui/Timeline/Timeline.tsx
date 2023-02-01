import styles from './styles.module.sass'
import Item from './Item'

interface IProps {
	children: React.ReactNode
	Item?: React.FC
}

const Timeline = ({ children }: IProps) => {
	return <div className={styles.timeline}>{children}</div>
}
Timeline.Item = Item

export default Timeline
