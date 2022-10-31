import { Badge } from '@mantine/core'
import { ChangeEvent, FC, useState } from 'react'
import { IProfileBadge } from 'src/types/profile'
import { DeletePopover, UpdatePopover } from './components'
import { useStyles } from './useStyles'

interface IProps {
	badge: IProfileBadge
	onDelete: (id: string) => void
	onUpdate: (id: string, label: string) => void
}

const ProfileBadge: FC<IProps> = ({ badge, onDelete, onUpdate }) => {
	const { classes } = useStyles()

	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [isUpdateOpen, setIsUpdateOpen] = useState(false)

	const [updatedLabel, setUpdatedLabel] = useState(badge.label)

	return (
		<Badge key={badge.id} className={classes.badge} data-testid="badge">
			{badge.label}

			<UpdatePopover
				isOpen={isUpdateOpen}
				onClose={() => {
					setIsUpdateOpen(false)
					setUpdatedLabel(badge.label)
				}}
				onOpen={() => setIsUpdateOpen(true)}
				onChange={opened => {
					setIsUpdateOpen(opened)
					setUpdatedLabel(badge.label)
				}}
				onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
					setUpdatedLabel(e.target.value)
				}
				onSubmit={() => {
					if (!updatedLabel.trim()) return

					onUpdate(badge.id, updatedLabel)
					setIsUpdateOpen(false)
				}}
				label={updatedLabel}
			/>

			<DeletePopover
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onOpen={() => setIsDeleteOpen(true)}
				onChange={setIsDeleteOpen}
				onDelete={() => {
					onDelete(badge.id)
					setIsDeleteOpen(false)
				}}
			/>
		</Badge>
	)
}

export default ProfileBadge
