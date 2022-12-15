import { ActionIcon, Flex, Menu, MenuItemProps } from '@mantine/core'
import Image from 'next/image'
import { FC } from 'react'

const ActionMenuItem: FC<MenuItemProps & { onClick?: () => void }> = ({
	children,
	...props
}) => <Menu.Item {...props}>{children}</Menu.Item>

interface Props {
	children: React.ReactNode
}

const ActionMenu: FC<Props> & {
	Item: FC<MenuItemProps & { onClick?: () => void }>
} = ({ children }) => {
	return (
		<Menu position="bottom-end">
			<Menu.Target>
				<Flex justify={'flex-end'}>
					<ActionIcon color={'brand'}>
						<Image src={'/menu.svg'} width={24} height={24} alt="" />
					</ActionIcon>
				</Flex>
			</Menu.Target>
			<Menu.Dropdown>{children}</Menu.Dropdown>
		</Menu>
	)
}
ActionMenu.Item = ActionMenuItem

export default ActionMenu
