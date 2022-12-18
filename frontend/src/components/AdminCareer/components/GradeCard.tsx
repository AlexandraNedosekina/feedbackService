import { Box, Title } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { QueryKeys, TCareerAdapter } from 'src/api'
import { useEditCareerStore } from 'src/stores'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const selectedGradeId = useEditCareerStore(state => state.selectedGradeId)
	const queryClient = useQueryClient()
	const data = queryClient.getQueryData<TCareerAdapter[]>([
		QueryKeys.CAREER_BY_USER_ID,
		id as string,
	])

	const grade = data?.find(i => i.id === +selectedGradeId)?.name

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
			<Title order={3}>{grade}</Title>
		</Box>
	)
}

export default GradeCard
