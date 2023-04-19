import { Tabs } from '@mantine/core'
import StaffPanel from './StaffPanel'
import TemplatesPanel from './TemplatesPanel'
import { useRouter } from 'next/router'

export default () => {
	const { query } = useRouter()

	return (
		<>
			<Tabs
				defaultValue={query.from === 'template' ? 'templates' : 'staff'}
				mt="xl"
			>
				<Tabs.List
					sx={() => ({
						maxWidth: 'max-content',
					})}
				>
					<Tabs.Tab value="staff">Сотрудники</Tabs.Tab>
					<Tabs.Tab value="templates">Шаблоны</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="staff" pt="xs">
					<StaffPanel />
				</Tabs.Panel>

				<Tabs.Panel value="templates" pt="xs">
					<TemplatesPanel />
				</Tabs.Panel>
			</Tabs>
		</>
	)
}
