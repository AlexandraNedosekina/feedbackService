import Icon from '@components/Icon'
import { ActionIcon, Flex } from '@mantine/core'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
	id: number
}

const GotoEditButton: FC<Props> = ({ id }) => {
	return (
		<Flex justify={'end'}>
			<Link href={`/career/edit/${id}`} style={{ textDecoration: 'none' }}>
				<ActionIcon color="brand">
					<Icon icon="edit" />
				</ActionIcon>
			</Link>
		</Flex>
	)
}

export default GotoEditButton
