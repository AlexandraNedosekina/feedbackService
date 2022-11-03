import { MantineProvider, Grid, Skeleton, Container } from '@mantine/core'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import '../styles/global.css'
import { mantineTheme } from '../styles/mantineTheme'

const child = <Skeleton height={140} radius="md" animate={false} />

export function GridAsymmetrical() {
	return (
		<Container my="md">
			<Grid>
				<Grid.Col xs={4}>{child}</Grid.Col>
				<Grid.Col xs={8}>{child}</Grid.Col>
				<Grid.Col xs={8}>{child}</Grid.Col>
				<Grid.Col xs={4}>{child}</Grid.Col>
				<Grid.Col xs={3}>{child}</Grid.Col>
				<Grid.Col xs={3}>{child}</Grid.Col>
				<Grid.Col xs={6}>{child}</Grid.Col>
			</Grid>
		</Container>
	)
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? (page => page)

	return (
		<MantineProvider
			withCSSVariables
			withGlobalStyles
			withNormalizeCSS
			theme={mantineTheme}
		>
			{getLayout(<Component {...pageProps} />)}
		</MantineProvider>
	)
}

export default MyApp
