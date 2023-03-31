import { Checkbox } from '@mantine/core'
import { withField } from '../lib'

const FormCheckbox = withField(Checkbox, { type: 'checkbox' })

export default FormCheckbox
