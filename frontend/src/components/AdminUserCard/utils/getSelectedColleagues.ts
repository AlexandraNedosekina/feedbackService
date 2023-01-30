import { Colleagues } from 'shared/api/generatedTypes'

export const getSelectedColleagues = (
	selectedRows: Record<number, boolean>,
	colleagues: Colleagues[]
): Colleagues[] => {
	return colleagues.filter((_colleague, index) => selectedRows[index])
}
