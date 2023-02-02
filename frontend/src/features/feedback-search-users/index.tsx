import { Icon } from 'shared/ui'
import {
	ActionIcon,
	Box,
	Checkbox,
	Group,
	Popover,
	Select,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useStyles } from './lib/useStyles'
import { useState } from 'react'

interface Props {
	value: string
	onChange: (value: string) => void
}

export function FeedbackSearchUsers({ value, onChange }: Props) {
	const { classes } = useStyles()

	const [isSortAsc, setIsSortAsc] = useState(true)

	return (
		<Group position="apart" spacing={'xs'}>
			<TextInput
				placeholder="Поиск"
				value={value}
				onChange={e => onChange(e.currentTarget.value)}
				icon={<Icon icon="search" />}
				sx={() => ({
					flex: '1',
				})}
			/>
			<Popover
				width={260}
				position="bottom"
				withArrow
				arrowSize={10}
				classNames={{
					dropdown: classes.dropdown,
					arrow: classes.arrow,
				}}
			>
				<Popover.Target>
					<ActionIcon color="brand" size="lg">
						<Icon icon="filter_alt" size={22} />
					</ActionIcon>
				</Popover.Target>
				<Popover.Dropdown>
					<Stack>
						<div>
							<Text size="sm">Сортировать по</Text>
							<Group noWrap spacing={5}>
								<Select
									data={['По фамилии', 'По должности', 'По отделу']}
									defaultValue="По фамилии"
								/>
								<Box
									sx={() => ({
										transform: isSortAsc
											? 'scale(1, -1)'
											: 'scale(1, 1)',
									})}
								>
									<ActionIcon
										color="brand"
										onClick={() => setIsSortAsc(!isSortAsc)}
									>
										<Icon icon="sort" size={22} />
									</ActionIcon>
								</Box>
							</Group>
						</div>
						<div>
							<Text size="sm">Группа</Text>
							<Select
								data={['Аналитики', 'Разработчики', 'Менеджеры']}
								defaultValue="Аналитики"
							/>
						</div>
						<Checkbox label="Показывать оцененных" defaultChecked />
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</Group>
	)
}
