import { createContext } from 'react'
import { avatarMachine } from 'src/machines'
import { InterpreterFrom } from 'xstate'

export const AvatarContext = createContext({
	avatarService: {} as InterpreterFrom<typeof avatarMachine>,
})
