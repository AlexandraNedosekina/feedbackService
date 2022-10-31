import Icon from '@components/Icon'
import { ActionIcon, Badge, Group, Input, Stack, Title } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import React, { FC, useState } from 'react'
import { IProfileBadge } from 'src/types/profile'
import ProfileBadge from '../ProfileBadge/ProfileBadge'
import { useStyles } from './useStyles'

interface IProps {
	badges: IProfileBadge[]
	title: string
}

const ProfileBadgesGroup: FC<IProps> = ({ badges: defaultBadges, title }) => {
	const { classes } = useStyles()

	const [badges, setBadges] = useState<IProfileBadge[]>(defaultBadges)
	const [isEditMode, setIsEditMode] = useState(false)

	const editInputRef = useClickOutside(() => setIsEditMode(false))
	const focusTrapRef = useFocusTrap()

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const label: string = (
			e.currentTarget.elements.namedItem('label') as RadioNodeList
		)?.value

		if (!label.trim()) return

		const newBadge = {
			id: String(Math.random()),
			label,
		}

		setBadges([...badges, newBadge])
		setIsEditMode(false)
	}

	const onDelete = (id: string) => {
		setBadges(badges.filter(badge => badge.id !== id))
	}

	const onUpdate = (id: string, label: string) => {
		setBadges(b => {
			const index = b.findIndex(badge => badge.id === id)
			b[index].label = label
			return [...b]
		})
	}

	return (
		<Stack spacing={'xs'}>
			<Title order={2}>{title}</Title>

			<Group>
				{badges.map(badge => (
					<ProfileBadge
						key={badge.id}
						badge={badge}
						onDelete={onDelete}
						onUpdate={onUpdate}
					/>
				))}

				{isEditMode ? (
					<div ref={editInputRef}>
						<form ref={focusTrapRef} onSubmit={onSubmit}>
							<Input
								name="label"
								aria-label="label"
								sx={() => ({
									border: 'none !important',
									margin: 0,
									padding: 0,
								})}
								rightSection={
									<ActionIcon
										type="submit"
										data-testid="add-badge-submit"
									>
										<Icon icon="add" />
									</ActionIcon>
								}
								autoComplete="off"
							/>
						</form>
					</div>
				) : (
					<Badge
						classNames={{
							root: classes.addBadge,
						}}
						onClick={() => setIsEditMode(true)}
						data-testid="add-badge"
					>
						<Group>
							<Icon icon="add" />
						</Group>
					</Badge>
				)}
			</Group>
		</Stack>
	)
}

export default ProfileBadgesGroup
