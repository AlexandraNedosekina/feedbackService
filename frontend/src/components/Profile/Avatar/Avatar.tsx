import Icon from '@components/Icon'
import {
	Avatar as MantineAvatar,
	Button,
	FileButton,
	Group,
	Popover,
	Text,
} from '@mantine/core'
import { FC, useMemo, useState } from 'react'
import styles from './Avatar.module.sass'
import { EditAvatarModal } from './components'

interface Props {
	src: string | null
}

const Avatar: FC<Props> = ({ src }) => {
	const [file, setFile] = useState<File | null>(null)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [deletePopoverOpen, setDeletePopoverOpen] = useState(false)
	const [state, setState] = useState<'upload' | 'edit' | null>(null)

	const editAvatarSrc: string = useMemo(() => {
		if (state === 'upload' && file) {
			return URL.createObjectURL(file)
		} else if (state === 'edit' && src) {
			return src
		}
		return ''
	}, [file, src, state])

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

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles.wrapper_circle}>
					<MantineAvatar src={src} radius={100} size={96} />
					<div className={styles.controls}>
						<FileButton onChange={onUpload} accept="image/*">
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
								<Button color="red">Да</Button>
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
				onClose={() => setEditModalOpen(false)}
				src={editAvatarSrc}
			/>
		</>
	)
}

export default Avatar
