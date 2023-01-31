import { useContext } from 'react'
import { BaseWrapperContext } from 'shared/ui/BaseLayout/index'

export const useBaseWrapperContext = () => {
	const context = useContext(BaseWrapperContext)

	if (!context) {
		throw new Error(
			'useBaseWrapperContext must be used within a BaseWrapperContext'
		)
	}

	return context
}
