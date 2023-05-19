import { Box, Flex, Skeleton as MSkeleton } from '@mantine/core'

export default function Skeleton() {
	return (
		<Box
			sx={theme => ({
				backgroundColor: theme.colors.brand[0],
				padding: theme.spacing.lg,
				marginTop: theme.spacing.lg,
				borderRadius: '4px',
				maxWidth: '600px',
			})}
		>
			<Flex justify={'space-between'}>
				<MSkeleton width={120} height={24} />
				<MSkeleton width={24} height={24} />
			</Flex>
			<MSkeleton width={80} height={24} mt="sm" />

			<MSkeleton width={140} height={22} mt="xl" />
			<MSkeleton width={170} height={22} mt="sm" ml="md" />

			<MSkeleton width={140} height={22} mt="md" />
			<MSkeleton width={170} height={22} mt="sm" ml="md" />

			<MSkeleton width={200} height={24} mt="xl" />
		</Box>
	)
}
