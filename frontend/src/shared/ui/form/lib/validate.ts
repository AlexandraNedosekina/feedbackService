export const required = (value: any) => {
	return value ? undefined : 'Обязательное поле'
}
