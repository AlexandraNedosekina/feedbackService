import { TextInput } from '@mantine/core'
import { useAddCareerGrade } from 'src/stores'
import shallow from 'zustand/shallow'

const TitleInput = () => {
	const { title, update } = useAddCareerGrade(
		state => ({
			title: state.title,
			update: state.update,
		}),
		shallow
	)

	return (
		<TextInput
			label="Название"
			value={title}
			onChange={e => update({ title: e.currentTarget.value })}
			autoComplete="off"
			withAsterisk
		/>
	)
}

export default TitleInput
