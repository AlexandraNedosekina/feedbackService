import {
	createCareerParams,
	deleteCareerParam,
	updateCareerTrack,
} from 'shared/api'
import {
	CareerParamCreate,
	CareerParamUpdate,
	CareerTrack,
} from 'shared/api/generatedTypes'

export interface IUpdateCareerTrackAllParams {
	paramsToDelete: string[]
	paramsToAdd: CareerParamCreate[]
	paramsToUpdate: CareerParamUpdate[]
	careerId: string
	name: string
	salary: number
}

export const updateCareerTrackAll = ({
	careerId,
	name,
	paramsToAdd,
	paramsToDelete,
	paramsToUpdate,
	salary,
}: IUpdateCareerTrackAllParams): Promise<
	PromiseSettledResult<CareerTrack>[]
> => {
	return new Promise((resolve, reject) => {
		try {
			const promises: Promise<any>[] = []

			if (paramsToDelete.length) {
				paramsToDelete.forEach(id => {
					promises.push(deleteCareerParam(id))
				})
			}
			if (paramsToAdd.length) {
				promises.push(createCareerParams(careerId, paramsToAdd))
			}
			if (paramsToUpdate.length) {
				promises.push(
					updateCareerTrack(careerId, {
						name,
						salary,
						params: paramsToUpdate,
					})
				)
			} else {
				promises.push(
					updateCareerTrack(careerId, {
						name,
						salary,
					})
				)
			}

			Promise.allSettled(promises).then(result => resolve(result))
		} catch (error) {
			reject(error)
		}
	})
}
