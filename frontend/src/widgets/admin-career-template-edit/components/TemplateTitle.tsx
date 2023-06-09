import {
	ActionIcon,
	createStyles,
	Flex,
	getStylesRef,
	Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Field, Form } from 'react-final-form'
import { QueryKeys } from 'shared/api'
import { EditableValue, Icon, required } from 'shared/ui'
import { updateTitle } from '../lib'

const useStyles = createStyles(() => ({
	actionIcon: {
		ref: getStylesRef('actionIcon'),
		opacity: '0',
		transition: 'opacity 0.2s',
	},
	root: {
		[`&:hover .${getStylesRef('actionIcon')}`]: {
			opacity: '1',
		},
	},
}))

interface IProps {
	text: string
}

export const TemplateTitle = ({ text }: IProps) => {
	const { classes } = useStyles()

	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (title: string) => updateTitle(title),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_TEMPLATE_BY_ID, id])
			showNotification({
				message: 'Название шаблона изменено',
				color: 'green',
			})
		},
	})

	return (
		<Form<{ title: string }>
			onSubmit={values => mutate(values.title)}
			initialValues={{
				title: text,
			}}
		>
			{({ handleSubmit, values }) => (
				<Flex mt="xl" align="center" gap="md" className={classes.root}>
					<Field
						name="title"
						validate={required}
						render={({ input, meta }) => (
							<EditableValue
								value={input.value}
								onChange={input.onChange}
								onSubmit={() => {
									handleSubmit()
								}}
								submitDisabled={meta.invalid || !meta.dirty}
								onClickOutside={() => input.onChange(text)}
								inputProps={{
									size: 'md',
									styles: {
										input: {
											fontWeight: 500,
										},
									},
									error: meta.error ? meta.error : '',
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									//@ts-ignore works fine
									maxLength: 50,
								}}
							>
								{({ setActive }) => (
									<>
										<Title order={2}>{values.title}</Title>
										<ActionIcon
											onClick={setActive}
											color="brand"
											loading={isLoading}
											className={classes.actionIcon}
										>
											<Icon icon="edit" size={18} />
										</ActionIcon>
									</>
								)}
							</EditableValue>
						)}
					/>
				</Flex>
			)}
		</Form>
	)
}
