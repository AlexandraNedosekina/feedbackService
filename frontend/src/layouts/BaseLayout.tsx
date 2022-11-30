import AppShell from '@components/AppShell'
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

interface IBaseLayoutContext {
	isEdit: boolean
	setIsEdit: Dispatch<SetStateAction<boolean | null>>
}

export const BaseLayoutContext = createContext<IBaseLayoutContext | null>(null)

const BaseLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const cookie = getCookie('refresh-token')
	const [isLoading, setIsLoading] = useState(true)
	const [isEdit, setIsEdit] = useState<boolean | null>(null)

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

	if (isLoading || !cookie || isEdit === null) {
		return (
			<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
				<LoadingOverlay visible={true} />
			</div>
		)
	}

	return (
		<BaseLayoutContext.Provider value={{ isEdit, setIsEdit }}>
			<AppShell>{children}</AppShell>
		</BaseLayoutContext.Provider>
	)
}

export default BaseLayout
