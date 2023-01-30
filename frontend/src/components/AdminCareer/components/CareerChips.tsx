import Icon from '@components/Icon'
import { ActionIcon, Chip, createStyles } from '@mantine/core'
import { useState } from 'react'
import { useAddCareerGrade, useEditCareerStore } from 'stores'
import shallow from 'zustand/shallow'
import AddGradeModal from './AddGradeModal'

const useStyles = createStyles((theme, _params, getRef) => ({
	input: {
		'&[data-completed=true]': {
			[`~ .${getRef('label')}`]: {
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
			[`~ .${getRef('label')}`]: {
				backgroundColor: theme.colors.brand[5],
				color: theme.white,
			},
		},
	},
	label: {
		ref: getRef('label'),
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
	const { grades, update } = useEditCareerStore(
		state => ({
			grades: state.grades,
			update: state.update,
		}),
		shallow
	)
	const restore = useAddCareerGrade(state => state.restore)
	const [isOpen, setIsOpen] = useState(false)

	function handleCloseModal() {
		setIsOpen(false)
		restore()
	}

	return (
		<>
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
				mt="xl"
				spacing="md"
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
			<AddGradeModal isOpen={isOpen} onClose={handleCloseModal} />
		</>
	)
}

export default CareerChips
