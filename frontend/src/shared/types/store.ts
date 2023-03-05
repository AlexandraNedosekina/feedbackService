export type UpdateAction<T> = {
	update: (value: {
		[key in keyof T]?: T[key]
	}) => void
}
