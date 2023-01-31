import { useContext } from 'react'
import { BaseLayoutContext } from 'shared/ui/BaseLayout/index'

export const useBaseLayoutContext = () => {
	const context = useContext(BaseLayoutContext)

	if (!context) {
		throw new Error(
			'useBaseLayoutContext must be used within a BaseLayoutContext'
		)
	}

	return context
}
