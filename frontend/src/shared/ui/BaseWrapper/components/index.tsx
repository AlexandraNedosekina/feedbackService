import { LoadingOverlay } from '@mantine/core'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from 'react'
import { useUser } from 'entities/user'

interface IBaseWrapperContext {
	isEdit: boolean
	setIsEdit: Dispatch<SetStateAction<boolean | null>>
}

export const BaseWrapperContext = createContext<IBaseWrapperContext | null>(
	null
)

export const BaseWrapper = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const cookie = getCookie('refresh-token')
	const [isLoading, setIsLoading] = useState(true)
	const [isEdit, setIsEdit] = useState<boolean | null>(null)
	const { isLoading: isUserLoading } = useUser()

	useEffect(() => {
		if (!cookie) {
			router.push('/')
		}

		setIsLoading(false)
	}, [cookie, router])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const edit = window.localStorage.getItem('edit')
			if (edit === 'true') {
				setIsEdit(true)
			} else {
				setIsEdit(false)
			}
		}
	}, [])

	if (isLoading || !cookie || isEdit === null || isUserLoading) {
		return (
			<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
				<LoadingOverlay visible={true} />
			</div>
		)
	}

	return (
		<BaseWrapperContext.Provider value={{ isEdit, setIsEdit }}>
			{children}
		</BaseWrapperContext.Provider>
	)
}
