import { Button, Group, Modal, Slider } from '@mantine/core'
import { FC, useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import styles from './EditAvatarModal.module.sass'

const MAX_ZOOM_SIZE = 9

interface Props {
	open: boolean
	onClose: () => void
	src?: string
}

const EditAvatarModal: FC<Props> = ({ onClose, open, src }) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const onCropComplete = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels)
		},
		[]
	)

	return (
		<Modal
			opened={open}
			onClose={onClose}
			withCloseButton={false}
			closeOnEscape={false}
			closeOnClickOutside={false}
			title="Редактировать изображение"
			size="lg"
		>
			<div className={styles['cropper-wrapper']}>
				<Cropper
					image={
						src ||
						'https://avatars.githubusercontent.com/u/14338007?s=460&u=3b0c0b0c0b0c0b0c0b0c0b0c0b0c0b0c0b0c0b0c&v=4'
					}
					crop={crop}
					zoom={zoom}
					aspect={1}
					cropShape="round"
					showGrid={false}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
					maxZoom={MAX_ZOOM_SIZE}
					// initialCroppedAreaPixels={
					// 	avatarThumbnail && JSON.parse(avatarThumbnail)
					// }
				/>
			</div>

			<div>
				<Slider
					value={zoom}
					onChange={setZoom}
					min={1}
					max={MAX_ZOOM_SIZE}
					step={0.1}
					label={null}
					mt="lg"
				/>

				<Group mt="lg" position="right">
					<Button>Сохранить</Button>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
				</Group>
			</div>
		</Modal>
	)
}

export default EditAvatarModal
