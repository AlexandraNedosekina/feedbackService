import { Flex, Skeleton as MSkeleton } from '@mantine/core'

export default function Skeleton() {
	return (
		<Flex gap="md" maw="600" wrap="wrap">
			{Array.from({ length: 3 }).map((_, i) => (
				<MSkeleton width={120} height={32} key={i} />
			))}
			<MSkeleton width={32} />
		</Flex>
	)
}
