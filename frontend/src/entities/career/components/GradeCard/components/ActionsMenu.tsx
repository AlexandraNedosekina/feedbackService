import { ActionIcon, Flex, Menu } from '@mantine/core'
import Image from 'next/image'

interface IProps {
	items: React.ReactNode
}

export const ActionsMenu = ({ items }: IProps) => {
	return (
		<>
			<Menu position="bottom-end">
				<Menu.Target>
					<Flex justify={'flex-end'}>
						<ActionIcon>
							<Image src={'/menu.svg'} width={24} height={24} alt="" />
						</ActionIcon>
					</Flex>
				</Menu.Target>
				<Menu.Dropdown>{items}</Menu.Dropdown>
			</Menu>
		</>
	)
}
