import { Skeleton as MSkeleton, Stack } from '@mantine/core'

export default function Skeleton() {
	return (
		<Stack spacing={0}>
			<MSkeleton height={30} mb={2} />
			<MSkeleton
				height={30}
				radius={0}
				sx={() => ({
					borderRadius: '4px 4px 0 0',
				})}
			/>
			<MSkeleton height={30} radius={0} />
			<MSkeleton height={30} radius={0} />
			<MSkeleton
				height={30}
				sx={() => ({
					borderRadius: '0 0 4px 4px',
				})}
			/>
		</Stack>
	)
}
