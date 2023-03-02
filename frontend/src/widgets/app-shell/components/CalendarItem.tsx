import { useRouter } from 'next/router'
import NavItem from './NavItem'

export default () => {
	const router = useRouter()

	return (
		<NavItem
			icon={'calendar_month'}
			href={'/calendar'}
			text={'Календарь встреч'}
			active={router.pathname.split('/')[1] === 'calendar'}
		/>
	)
}
