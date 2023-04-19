import { ActionIcon, Flex } from '@mantine/core'
import Link from 'next/link'
import { Icon } from 'shared/ui'

interface IProps {
	href: string
}

const GotoEditButton = ({ href }: IProps) => {
	return (
		<Flex justify={'end'}>
			<Link href={href} style={{ textDecoration: 'none' }}>
				<ActionIcon color="brand.3">
					<Icon icon="edit" size={20} />
				</ActionIcon>
			</Link>
		</Flex>
	)
}

export default GotoEditButton
