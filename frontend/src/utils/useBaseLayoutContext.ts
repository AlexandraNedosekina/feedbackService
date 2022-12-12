import { useContext } from 'react'
import { BaseLayoutContext } from 'src/layouts'

export const useBaseLayoutContext = () => {
	const context = useContext(BaseLayoutContext)

	if (!context) {
		throw new Error(
			'useBaseLayoutContext must be used within a BaseLayoutContext'
		)
	}

	return context
}
