import { Checkbox } from '@mantine/core'
import { FC, useState } from 'react'
import ColleaguesTable from './ColleaguesTableModal'

const AddColleaguesModalView: FC = () => {
	const [isOnlySelected, setIsOnlySelected] = useState(false)

	return (
		<>
			<ColleaguesTable isOnlySelectedColleagues={isOnlySelected} />

			<Checkbox
				label="Показать только выбранных"
				my="sm"
				checked={isOnlySelected}
				onChange={e => setIsOnlySelected(e.currentTarget.checked)}
			/>
		</>
	)
}

export default AddColleaguesModalView
