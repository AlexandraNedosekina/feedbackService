const withTM = require('next-transpile-modules')([
	'@fullcalendar/common',
	'@fullcalendar/daygrid',
	'@fullcalendar/react',
	'@fullcalendar/timegrid',
	'@fullcalendar/interaction',
])
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
}

module.exports = withTM(nextConfig)
