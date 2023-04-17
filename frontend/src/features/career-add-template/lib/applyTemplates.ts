import { applyCareerTemplate } from 'shared/api'

interface IOptions {
	userId: number
	ids: string[]
}

export const applyTemplates = ({ ids, userId }: IOptions) => {
	const promises: Promise<any>[] = []

	const parsedIds: Record<string, number[]> = {}
	for (let i = 0; i < ids.length; i++) {
		const [parent, child] = ids[i].split('.')

		if (!parsedIds[parent]) {
			parsedIds[parent] = []
			if (child) parsedIds[parent].push(+child)
		} else {
			if (child) parsedIds[parent].push(+child)
		}
	}

	Object.entries(parsedIds).forEach(([key, value]) => {
		const request = applyCareerTemplate(key, {
			user_ids: [userId],
			indexes: value.length === 0 ? undefined : value,
		})

		promises.push(request)
	})

	return Promise.all(promises)
}
