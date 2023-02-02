export const required = (value: string) => {
	return value ? undefined : 'Обязательное поле'
}
