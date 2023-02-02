import {
	Avatar as MantineAvatar,
	Button,
	FileButton,
	Group,
	Popover,
	Text,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import {
	createAvatar,
	deleteAvatar,
	getAvatarThumbnail,
	getOriginalAvatar,
	QueryKeys,
	updateAvatarThumbnail,
} from 'shared/api'
import {
	AvatarUpdate,
	BodyCreateAvaterUserUserIdAvatarPost,
} from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
import { useUser } from 'entities/user'
import { EditModal } from './EditModal'
import styles from './styles.module.sass'

const Avatar = () => {
	const { user } = useUser()

	const [file, setFile] = useState<File | null>(null)
	const resetRef = useRef<() => void>(null)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [deletePopoverOpen, setDeletePopoverOpen] = useState(false)
	const [state, setState] = useState<'upload' | 'edit' | null>(null)
	const [isSaving, setIsSaving] = useState(false)

	const queryClient = useQueryClient()

	const { data: avatar } = useQuery({
		queryKey: [QueryKeys.AVATAR],
		queryFn: () => getAvatarThumbnail(user?.id),
	})

	const { data: originalAvatar } = useQuery({
		queryKey: [QueryKeys.AVATAR_ORIGINAL],
		queryFn: () => getOriginalAvatar(user?.id),
	})

	const { mutate: createMutate, isLoading: isCreateLoading } = useMutation({
		mutationFn: (data: BodyCreateAvaterUserUserIdAvatarPost) =>
			createAvatar(user.id, data),
		onSuccess: () => {
			setEditModalOpen(false)
			queryClient.invalidateQueries([QueryKeys.AVATAR])
			clearFile()
		},
		onMutate: () => setIsSaving(true),
		onSettled: () => setIsSaving(false),
	})

	const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation({
		mutationFn: () => deleteAvatar(user.id),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.AVATAR])
			setDeletePopoverOpen(false)
		},
		onMutate: () => setIsSaving(true),
		onSettled: () => setIsSaving(false),
	})

	const { mutate: updateThumbnailMutate, isLoading: isUpdateLoading } =
		useMutation({
			mutationFn: (data: AvatarUpdate) =>
				updateAvatarThumbnail(user.id, data),
			onSuccess: () => {
				setEditModalOpen(false)
				queryClient.invalidateQueries([QueryKeys.AVATAR])
			},
			onMutate: () => setIsSaving(true),
			onSettled: () => setIsSaving(false),
		})

	const editAvatarSrc: string = useMemo(() => {
		if (state === 'upload' && file) {
			return URL.createObjectURL(file)
		} else if (state === 'edit' && originalAvatar) {
			return originalAvatar
		}
		return ''
	}, [file, originalAvatar, state])

	function onEdit() {
		setState('edit')
		setEditModalOpen(true)
	}

	function onUpload(file: File | null) {
		if (file) {
			setState('upload')
			setFile(file)
			setEditModalOpen(true)
		}
	}

	function onSave({
		height,
		width,
		x,
		y,
	}: Omit<BodyCreateAvaterUserUserIdAvatarPost, 'file'>) {
		if (file) {
			createMutate({
				file,
				width,
				height,
				x,
				y,
			})
		} else {
			updateThumbnailMutate({
				width,
				height,
				x,
				y,
			})
		}
	}

	function onClose() {
		setEditModalOpen(false)
		clearFile()
	}

	function clearFile() {
		setFile(null)
		resetRef.current?.()
	}

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles.wrapper_circle}>
					<MantineAvatar
						src={!isSaving ? avatar : null}
						radius={100}
						size={96}
					/>
					<div className={styles.controls}>
						<FileButton
							resetRef={resetRef}
							onChange={onUpload}
							accept="image/*"
						>
							{props => (
								<div {...props} className={styles.controls_button}>
									<Icon icon="file_upload" />
								</div>
							)}
						</FileButton>
						{avatar && (
							<div className={styles.controls_button} onClick={onEdit}>
								<Icon icon="edit" />
							</div>
						)}
					</div>
				</div>
				{avatar && (
					<Popover
						opened={deletePopoverOpen}
						onChange={setDeletePopoverOpen}
						withArrow
					>
						<Popover.Target>
							<div
								className={styles.delete}
								onClick={() => setDeletePopoverOpen(o => !o)}
							>
								<Icon icon="close" />
							</div>
						</Popover.Target>
						<Popover.Dropdown>
							<Text>Удалить фото?</Text>

							<Group>
								<Button
									color="red"
									onClick={() => deleteMutate()}
									loading={isDeleteLoading}
								>
									Да
								</Button>
								<Button onClick={() => setDeletePopoverOpen(false)}>
									Нет
								</Button>
							</Group>
						</Popover.Dropdown>
					</Popover>
				)}
			</div>
			<EditModal
				open={editModalOpen}
				onClose={onClose}
				src={editAvatarSrc}
				onSave={onSave}
				isSaveButtonLoading={isCreateLoading || isUpdateLoading}
			/>
		</>
	)
}

export default Avatar
