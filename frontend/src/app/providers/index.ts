import compose from 'compose-function'
import { withMantine } from './withMantine'
import { withQueryClient } from './withQueryClient'

export const withProviders = compose(withMantine, withQueryClient)
export * from './withQueryClient'
