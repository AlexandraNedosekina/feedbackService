import { createContext, useContext } from 'react'
import { INavbarContext } from '../types'

export const NavbarContext = createContext<INavbarContext | null>(null)

export const useNavbarContext = () => {
	const all = useContext(NavbarContext)

	if (!all) {
		throw new Error('useNavbarContext must be used inside NavbarContext')
	}

	return all
}
