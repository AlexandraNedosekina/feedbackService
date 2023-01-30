import Icon from '@components/Icon'
import { ActionIcon, Badge, Group, Input, Stack, Title } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { FC, useState } from 'react'
import {
	QueryKeys,
	TProfileBadges,
	TUpdateUser,
	TUserAdapter,
	updateUser,
} from 'shared/api'
import { IProfileBadge } from 'types/profile'
import { useUser } from 'utils/useUser'
import ProfileBadge from '../ProfileBadge'
import { useStyles } from './useStyles'

interface Props {
	badges: IProfileBadge[]
	title: string
	api_key: keyof TProfileBadges
}

const ProfileBadgesGroup: FC<Props> = ({ badges, title, api_key }) => {
	const { classes } = useStyles()

	const { user } = useUser()
	const queryClient = useQueryClient()

	const { mutate: updateUserMutate } = useMutation({
		mutationFn: (data: Partial<TProfileBadges>) => {
			return updateUser(user?.id, {
				[api_key]: data[api_key]?.map(item => item.label),
			} as TUpdateUser)
		},
		onMutate: async data => {
			await queryClient.cancelQueries({ queryKey: [QueryKeys.USER] })

			const previousUser = queryClient.getQueryData([QueryKeys.USER])

			queryClient.setQueryData<TUserAdapter>([QueryKeys.USER], old => {
				if (!old) return undefined

				return {
					...old,
					...data,
				}
			})

			return { previousUser }
		},
		onError: (error, __, context: any) => {
			queryClient.setQueryData([QueryKeys.USER], context.previousUser)
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
		},
		onSettled: () => queryClient.invalidateQueries([QueryKeys.USER]),
	})

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
			id: Date.now(),
			label,
		}

		const updatedBadges = [...badges, newBadge]

		setIsEditMode(false)

		updateUserMutate({
			[api_key]: updatedBadges,
		})
	}

	const onDelete = (id: number) => {
		const updatedBadges = badges.filter(badge => badge.id !== id)

		updateUserMutate({
			[api_key]: updatedBadges,
		})
	}

	const onUpdate = (id: number, label: string) => {
		const updatedBadges = badges.map(badge => {
			if (badge.id === id) {
				badge.label = label
			}
			return badge
		})

		updateUserMutate({
			[api_key]: updatedBadges,
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
								size="xs"
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
