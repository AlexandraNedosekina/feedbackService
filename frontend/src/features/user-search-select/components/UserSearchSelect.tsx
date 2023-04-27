import { TMultiSelectProps, TSelectProps } from '../types'
import { MultiSelect } from './MultiSelect'
import { Select } from './Select'

type IProps = TSelectProps | TMultiSelectProps

function isMultiGuard(props: IProps): props is TMultiSelectProps {
	return 'multi' in props
}

const componentsMapper: Record<string, typeof MultiSelect | typeof Select> = {
	multi: MultiSelect,
	select: Select,
}

function UserSearchSelect(props: TSelectProps): JSX.Element
function UserSearchSelect(props: TMultiSelectProps): JSX.Element
function UserSearchSelect(props: IProps): JSX.Element {
	const Component = componentsMapper[isMultiGuard(props) ? 'multi' : 'select']

	return <Component {...props} />
}

// function some() {
//    return (
//       <UserSearchSelect value={'ff'}  multi />
//    )
// }
