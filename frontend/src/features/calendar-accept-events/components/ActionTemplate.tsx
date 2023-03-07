import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { Icon, TIcons } from 'shared/ui'

type TProps = {
	icon: TIcons
	tooltipText?: string
} & ActionIconProps

export default function ({ icon, tooltipText, ...actionIconProps }: TProps) {
	const props: ActionIconProps = { variant: 'filled', ...actionIconProps }

	if (!tooltipText) {
		return (
			<ActionIcon {...props}>
				<Icon icon={icon} weight={600} />
			</ActionIcon>
		)
	}

	return (
		<Tooltip label={tooltipText} withArrow openDelay={200}>
			<ActionIcon {...props}>
				<Icon icon={icon} weight={600} />
			</ActionIcon>
		</Tooltip>
	)
}
