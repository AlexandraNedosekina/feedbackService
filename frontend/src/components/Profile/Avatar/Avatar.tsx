import Icon from '@components/Icon'
import {
	Avatar as MantineAvatar,
	Button,
	FileButton,
	Group,
	Popover,
	Text,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useMemo, useRef, useState } from 'react'
import {
	createAvatar,
	deleteAvatar,
	getOriginalAvatar,
	QueryKeys,
} from 'src/api'
import { BodyCreateAvaterUserUserIdAvatarPost } from 'src/api/generatedTypes'
import styles from './Avatar.module.sass'
import { EditAvatarModal } from './components'

interface Props {
	src: string | null
	isAvatarFetching: boolean
}

const Avatar: FC<Props> = ({ src, isAvatarFetching }) => {
	const [file, setFile] = useState<File | null>(null)
	const resetRef = useRef<() => void>(null)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [deletePopoverOpen, setDeletePopoverOpen] = useState(false)
	const [state, setState] = useState<'upload' | 'edit' | null>(null)

	const queryClient = useQueryClient()

	const { data: originalAvatar } = useQuery({
		queryFn: () => getOriginalAvatar(1),
	})

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: BodyCreateAvaterUserUserIdAvatarPost) =>
			createAvatar(1, data),
		onSuccess: () => {
			setEditModalOpen(false)
			queryClient.invalidateQueries([QueryKeys.USER])
			clearFile()
		},
	})

	const { mutate: deleteAvatarMutate, isLoading: isDeleteLoading } =
		useMutation({
			mutationFn: () => deleteAvatar(1),
			onSuccess: () => {
				queryClient.invalidateQueries([QueryKeys.USER])
				setDeletePopoverOpen(false)
			},
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

	function onCreateAvatar({
		height,
		width,
		x,
		y,
	}: Omit<BodyCreateAvaterUserUserIdAvatarPost, 'file'>) {
		if (file) {
			mutate({
				file,
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
						src={!isAvatarFetching ? src : null}
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
						{src && (
							<div className={styles.controls_button} onClick={onEdit}>
								<Icon icon="edit" />
							</div>
						)}
					</div>
				</div>
				{src && (
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
									onClick={() => deleteAvatarMutate()}
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
			<EditAvatarModal
				open={editModalOpen}
				onClose={onClose}
				src={editAvatarSrc}
				onCreate={onCreateAvatar}
				isCreateLoading={isLoading}
			/>
		</>
	)
}

export default Avatar
