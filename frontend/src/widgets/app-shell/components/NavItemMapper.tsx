import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React from 'react'
import { INavItem, TNavPages } from '../types'
import CalendarItem from './CalendarItem'
import NavItem from './NavItem'

const mapper: Record<TNavPages, INavItem> = {
	career: {
		type: 'base',
		icon: 'star',
		href: '/feedback',
		text: 'Обратная связь',
	},
	feedback: {
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
	isFull: boolean
	closeMenu: () => void
}

export default ({ name, isFull, closeMenu }: IProps) => {
	const item = mapper[name]

	const theme = useMantineTheme()
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
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
			isFull={isMobile ? true : isFull}
			iconProps={
				item.icon === 'star'
					? {
							filled: true,
					  }
					: undefined
			}
			active={router.pathname.split('/')[1] === item.href.split('/')[1]}
			closeMenu={closeMenu}
		/>
	)
}
