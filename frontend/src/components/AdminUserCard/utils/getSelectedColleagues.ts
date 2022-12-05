import { Colleagues } from 'src/api/generatedTypes'

export const getSelectedColleagues = (
	selectedRows: Record<number, boolean>,
	colleagues: Colleagues[]
): Colleagues[] => {
	return colleagues.filter((_colleague, index) => selectedRows[index])
}
