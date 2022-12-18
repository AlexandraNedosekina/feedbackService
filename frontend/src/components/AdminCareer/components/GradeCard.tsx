import Icon from '@components/Icon'
import { ActionIcon, Box, Flex, Group, Menu, Title } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
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
			<Group position="apart">
				<Title order={3}>{grade}</Title>
				<Menu position="bottom-end">
					<Menu.Target>
						<Flex justify={'flex-end'}>
							<ActionIcon>
								<Image
									src={'/menu.svg'}
									width={24}
									height={24}
									alt=""
								/>
							</ActionIcon>
						</Flex>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item icon={<Icon icon="delete" />} color="red">
							Удалить
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Box>
	)
}

export default GradeCard
