import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { Icon, TIcons } from 'shared/ui'

type TProps = {
	icon: TIcons
	tooltipText?: string
	onClick?: () => void
} & ActionIconProps

export default function ({
	icon,
	tooltipText,
	onClick,
	...actionIconProps
}: TProps) {
	const props: ActionIconProps = { variant: 'filled', ...actionIconProps }

	if (!tooltipText) {
		return (
			<ActionIcon {...props} onClick={onClick}>
				<Icon icon={icon} weight={600} />
			</ActionIcon>
		)
	}

	return (
		<Tooltip label={tooltipText} withArrow openDelay={200}>
			<ActionIcon {...props} onClick={onClick}>
				<Icon icon={icon} weight={600} />
			</ActionIcon>
		</Tooltip>
	)
}
