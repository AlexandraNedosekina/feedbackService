/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AvatarUpdate */
export interface AvatarUpdate {
	/** Width */
	width: number
	/** Height */
	height: number
	/** X */
	x: number
	/** Y */
	y: number
}

/** Body_create_avater_user__user_id__avatar_post */
export interface BodyCreateAvaterUserUserIdAvatarPost {
	/**
	 * File
	 * @format binary
	 */
	file: File
	/** Width */
	width: number
	/** Height */
	height: number
	/** X */
	x: number
	/** Y */
	y: number
}

/** Fact */
export interface Fact {
	/** Id */
	id?: number
	/** Description */
	description: string
	/** Owner Id */
	owner_id?: number
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[]
}

/** JobExpectation */
export interface JobExpectation {
	/** Id */
	id?: number
	/** Description */
	description: string
	/** Owner Id */
	owner_id?: number
}

/** Role */
export interface Role {
	/** Id */
	id?: number
	/** Description */
	description:
		| 'employee'
		| 'trainee'
		| 'mentor'
		| 'manager'
		| 'hr'
		| 'boss'
		| 'admin'
	/** Owner Id */
	owner_id?: number
}

/** Skill */
export interface Skill {
	/** Id */
	id?: number
	/** Description */
	description: string
	/** Owner Id */
	owner_id?: number
}

/** User */
export interface User {
	/** Job Title */
	job_title?: string
	/** Roles */
	roles?: Role[]
	/** Facts */
	facts?: Fact[]
	/** Skills */
	skills?: Skill[]
	/** Job Expectations */
	job_expectations?: JobExpectation[]
	/** Work Format */
	work_format?: 'home' | 'office' | 'part'
	/**
	 * Work Hours Start
	 * @format time
	 */
	work_hours_start?: string
	/**
	 * Work Hours End
	 * @format time
	 */
	work_hours_end?: string
	/** Meeting Readiness */
	meeting_readiness?: boolean
	/** Email */
	email?: string
	/** Full Name */
	full_name?: string
	/** Id */
	id: number
}

/** UserCreate */
export interface UserCreate {
	/** Email */
	email: string
	/** Full Name */
	full_name: string
}

/** UserUpdate */
export interface UserUpdate {
	/** Job Title */
	job_title?: string
	/** Roles */
	roles?: (
		| 'employee'
		| 'trainee'
		| 'mentor'
		| 'manager'
		| 'hr'
		| 'boss'
		| 'admin'
	)[]
	/** Facts */
	facts?: string[]
	/** Skills */
	skills?: string[]
	/** Job Expectations */
	job_expectations?: string[]
	/** Work Format */
	work_format?: 'home' | 'office' | 'part'
	/**
	 * Work Hours Start
	 * @format time
	 */
	work_hours_start?: string
	/**
	 * Work Hours End
	 * @format time
	 */
	work_hours_end?: string
	/** Meeting Readiness */
	meeting_readiness?: boolean
	/** Email */
	email?: string
	/** Full Name */
	full_name?: string
}

/** ValidationError */
export interface ValidationError {
	/** Location */
	loc: any[]
	/** Message */
	msg: string
	/** Error Type */
	type: string
}
