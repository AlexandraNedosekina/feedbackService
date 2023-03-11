import { useRouter } from 'next/router'
import React from 'react'
import { INavItem, TNavPages } from '../types'
import CalendarItem from './CalendarItem'
import NavItem from './NavItem'

const mapper: Record<TNavPages, INavItem> = {
	feedback: {
		type: 'base',
		icon: 'star',
		href: '/feedback',
		text: 'Обратная связь',
	},
	career: {
		type: 'base',
		icon: 'trending_up',
		href: '/career',
		text: 'Карьерный рост',
	},
	calendar: {
		type: 'component',
		component: CalendarItem,
	},
}

interface IProps {
	name: TNavPages
}

export default ({ name }: IProps) => {
	const item = mapper[name]

	const router = useRouter()

	if (item.type === 'component') {
		const Component = item.component as React.FC
		return <Component />
	}

	if (item.type !== 'base' || !item.icon || !item.href || !item.text) {
		throw new Error('See INavItem')
	}

	return (
		<NavItem
			icon={item.icon}
			href={item.href}
			text={item.text}
			iconProps={
				item.icon === 'star'
					? {
							filled: true,
					  }
					: undefined
			}
			active={router.pathname.split('/')[1] === item.href.split('/')[1]}
		/>
	)
}
