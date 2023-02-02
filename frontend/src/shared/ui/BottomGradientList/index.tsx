import { Box } from '@mantine/core'

export const BottomGradientList = () => {
	return (
		<Box
			sx={() => ({
				background:
					'linear-gradient(180deg, rgba(59, 130, 191, 0) 0%, rgba(59, 130, 191, 0.28) 100%)',
				borderRadius: '0px 0px 4px 4px',
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: '40px',
			})}
		></Box>
	)
}
