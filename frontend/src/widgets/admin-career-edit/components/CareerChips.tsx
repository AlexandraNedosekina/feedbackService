import {
	ActionIcon,
	Chip,
	createStyles,
	Flex,
	getStylesRef,
} from '@mantine/core'
import { careerModel } from 'entities/career'
import { useState } from 'react'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'
import { EditModal } from './EditModal'

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

const CareerChips = () => {
	const { classes } = useStyles()
	const { grades, update } = careerModel.useEdit(
		state => ({
			grades: state.grades,
			update: state.update,
		}),
		shallow
	)
	const restore = careerModel.useEditGrade(state => state.restore)
	const [isOpen, setIsOpen] = useState(false)

	function handleCloseModal() {
		setIsOpen(false)
		restore()
	}

	return (
		<>
			<Flex mt="xl" gap="md">
				<Chip.Group
					defaultValue={grades
						.filter(({ isDefault }) => isDefault)
						.map(({ value }) => value)
						.toString()}
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
					<ActionIcon
						variant="light"
						color="brand.6"
						size="lg"
						onClick={() => setIsOpen(true)}
					>
						<Icon icon="add" size={22} />
					</ActionIcon>
				</Chip.Group>
			</Flex>
			<EditModal isOpen={isOpen} onClose={handleCloseModal} />
		</>
	)
}

export default CareerChips
