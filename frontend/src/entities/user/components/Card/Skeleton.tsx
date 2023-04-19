import { Group, Skeleton as MSkeleton, Stack } from '@mantine/core'

export default function Skeleton() {
	return (
		<Group>
			<MSkeleton height={64} circle />
			<Stack spacing={8}>
				<MSkeleton height={24} width="200" />
				<MSkeleton height={15} width="120" />
			</Stack>
		</Group>
	)
}
