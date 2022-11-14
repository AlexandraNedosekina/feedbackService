import { Select } from '@mantine/core'

function Search() {
	return (
		<Select
			placeholder="Найти"
			searchable
			nothingFound="Не существует"
			data={['who', 'was', 'there']}
		/>
	)
}
export default Search
