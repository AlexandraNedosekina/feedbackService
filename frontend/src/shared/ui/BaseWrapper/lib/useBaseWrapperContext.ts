import { useContext } from 'react'
import { BaseWrapperContext } from '../components'

export const useBaseWrapperContext = () => {
	const context = useContext(BaseWrapperContext)

	if (!context) {
		throw new Error(
			'useBaseWrapperContext must be used within a BaseWrapperContext'
		)
	}

	return context
}
