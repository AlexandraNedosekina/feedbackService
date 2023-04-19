import {
	ActionIcon,
	Chip,
	createStyles,
	Flex,
	getStylesRef,
	Modal,
	Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { careerModel } from 'entities/career'
import { PersonalGradeAdd, TemplateGradeAdd } from 'features/career-grade'
import { Icon } from 'shared/ui'

const useStyles = createStyles(theme => ({
	input: {
		'&[data-completed=true]': {
			[`~ .${getStylesRef('label')}`]: {
				backgroundColor: theme.colors.brand[0],
				borderColor: theme.colors.brand[0],
				'&[data-checked]': {
					'&, &:hover': {
						borderColor: theme.colors.brand[5],
					},
				},
			},
		},
		'&[data-current=true]': {
			[`~ .${getStylesRef('label')}`]: {
				backgroundColor: theme.colors.brand[5],
				color: theme.white,
			},
		},
	},
	label: {
		ref: getStylesRef('label'),
		paddingInline: theme.spacing.lg,
		borderRadius: '4px',
		color: theme.colors.brand[5],
		'&[data-checked]': {
			'&, &:hover': {
				backgroundColor: theme.colors.brand[0],
				borderColor: theme.colors.brand[5],
			},
			paddingInline: theme.spacing.lg,
		},
	},
	iconWrapper: {
		display: 'none',
	},
}))

interface IProps {
	type: 'personal' | 'template'
	addSection: (props: { openModal: () => void }) => JSX.Element
}

export const Chips = ({ type, addSection }: IProps) => {
	const { classes } = useStyles()
	const { grades, update, selectedGradeId } = careerModel.useEdit()
	const [isAddModalOpen, addModalHandlers] = useDisclosure(false)

	function handleCloseModal() {
		addModalHandlers.close()
	}

	return (
		<>
			<Flex mt="xl" gap="md" maw={600} wrap="wrap">
				<Chip.Group
					value={String(selectedGradeId)}
					onChange={value => {
						if (!Array.isArray(value)) {
							update({ selectedGradeId: value })
						}
					}}
				>
					{grades.map(({ label, value, isCompleted, isCurrent }) => (
						<Chip
							key={value}
							classNames={classes}
							data-current={isCurrent}
							data-completed={isCompleted}
							value={String(value)}
							size="lg"
						>
							{label}
						</Chip>
					))}
					{addSection({ openModal: addModalHandlers.open })}
				</Chip.Group>
			</Flex>
			<Modal
				opened={isAddModalOpen}
				onClose={handleCloseModal}
				title={<Title order={4}>Создание этапа</Title>}
				size="lg"
			>
				{type === 'personal' ? (
					<PersonalGradeAdd onDone={addModalHandlers.close} />
				) : type === 'template' ? (
					<TemplateGradeAdd onDone={addModalHandlers.close} />
				) : null}
			</Modal>
		</>
	)
}
