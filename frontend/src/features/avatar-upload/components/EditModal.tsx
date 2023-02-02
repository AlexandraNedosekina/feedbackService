import { Button, Group, Modal, Slider } from '@mantine/core'
import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { BodyCreateAvaterUserUserIdAvatarPost } from 'shared/api/generatedTypes'
import { useUser } from 'entities/user'
import styles from './edit-modal.module.sass'

const MAX_ZOOM_SIZE = 9

interface IProps {
	open: boolean
	onClose: () => void
	onSave: (data: Omit<BodyCreateAvaterUserUserIdAvatarPost, 'file'>) => void
	isSaveButtonLoading: boolean
	src?: string
}

export const EditModal = ({
	onClose,
	open,
	src,
	isSaveButtonLoading,
	onSave: onCreate,
}: IProps) => {
	const { user } = useUser()

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
					image={src}
					crop={crop}
					zoom={zoom}
					aspect={1}
					cropShape="round"
					showGrid={false}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
					maxZoom={MAX_ZOOM_SIZE}
					initialCroppedAreaPixels={
						user.avatar && {
							width: user.avatar.width,
							height: user.avatar.height,
							x: user.avatar.x,
							y: user.avatar.y,
						}
					}
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
					<Button
						loading={isSaveButtonLoading}
						onClick={() => {
							if (croppedAreaPixels) {
								onCreate({
									width: croppedAreaPixels.width,
									height: croppedAreaPixels.height,
									x: croppedAreaPixels.x,
									y: croppedAreaPixels.y,
								})
							}
						}}
					>
						Сохранить
					</Button>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
				</Group>
			</div>
		</Modal>
	)
}
