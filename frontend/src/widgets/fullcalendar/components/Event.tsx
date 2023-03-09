import { EventContentArg } from '@fullcalendar/react'
import { Badge, Box, Text } from '@mantine/core'

interface IProps extends EventContentArg {}

export default function ({
	timeText,
	event: { title, extendedProps },
}: IProps) {
	console.log(extendedProps)
	return (
		<Box
			w="100%"
			sx={theme => ({
				borderRadius: '4px',
				padding: '4px',
				backgroundColor: theme.colors.brand[5],
				color: 'white',
			})}
		>
			{/* <Text weight="bolder">{timeText}</Text>*/}
			<Text>{title}</Text>
			{extendedProps.status === 'rejected' ? (
				<Badge size="md" variant={'filled'} color="red.7">
					Отклонено
				</Badge>
			) : null}
		</Box>
	)
}
