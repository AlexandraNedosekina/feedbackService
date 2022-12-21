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

/** AddSkillPromts */
export interface AddSkillPromts {
	/** Name */
	name: string[]
}

/** Avatar */
export interface Avatar {
	/** Id */
	id?: number
	/** Original Path */
	original_path?: string
	/** Thumbnail Path */
	thumbnail_path?: string
	/** Thumbnail Url */
	thumbnail_url: string
	/** X */
	x: number
	/** Y */
	y: number
	/** Width */
	width: number
	/** Height */
	height: number
	/** Owner Id */
	owner_id?: number
}

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

/** CareerParam */
export interface CareerParam {
	/** Id */
	id: number
	/** Career Id */
	career_id: number
	/** Description */
	description: string
	/** Type */
	type: 'to_complete' | 'to_learn'
	/** Is Completed */
	is_completed: boolean
}

/** CareerParamCreate */
export interface CareerParamCreate {
	/** Description */
	description: string
	/** Type */
	type: 'to_complete' | 'to_learn'
}

/** CareerParamUpdate */
export interface CareerParamUpdate {
	/** Id */
	id: number
	/** Description */
	description?: string
	/** Type */
	type?: 'to_complete' | 'to_learn'
	/** Is Completed */
	is_completed?: boolean
}

/** CareerTrack */
export interface CareerTrack {
	/** Id */
	id: number
	/** Name */
	name?: string
	/** Salary */
	salary?: number
	/** User Id */
	user_id: number
	/** Is Completed */
	is_completed: boolean
	/** Is Current */
	is_current: boolean
	/** Params */
	params?: CareerParam[]
}

/** CareerTrackCreate */
export interface CareerTrackCreate {
	/** Name */
	name?: string
	/** Salary */
	salary?: number
	/** User Id */
	user_id: number
	/** Params */
	params?: CareerParamCreate[]
}

/** CareerTrackUpdate */
export interface CareerTrackUpdate {
	/** Name */
	name?: string
	/** Salary */
	salary?: number
	/** Is Completed */
	is_completed?: boolean
	/** Is Current */
	is_current?: boolean
	/** Params */
	params?: CareerParamUpdate[]
}

/** Colleagues */
export interface Colleagues {
	/** Id */
	id: number
	colleague: UserDetails
	/** Owner Id */
	owner_id: number
}

/** ColleaguesIdList */
export interface ColleaguesIdList {
	/** Colleagues Ids */
	colleagues_ids: number[]
}

/** Event */
export interface Event {
	/** Id */
	id: number
	/**
	 * Date Start
	 * @format date-time
	 */
	date_start: string
	/**
	 * Date Stop
	 * @format date-time
	 */
	date_stop: string
	/** An enumeration. */
	status: EventStatus
}

/** EventCreate */
export interface EventCreate {
	/**
	 * Date Start
	 * Event start date in utc
	 * @format date-time
	 */
	date_start: string
	/**
	 * Date Stop
	 * Event end date in utc
	 * @format date-time
	 */
	date_stop: string
}

/**
 * EventStatus
 * An enumeration.
 */
export enum EventStatus {
	Waiting = 'waiting',
	Active = 'active',
	Archived = 'archived',
}

/** EventUpdate */
export interface EventUpdate {
	/**
	 * Date Start
	 * @format date-time
	 */
	date_start?: string
	/**
	 * Date Stop
	 * @format date-time
	 */
	date_stop?: string
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

/** Feedback */
export interface Feedback {
	/** Id */
	id: number
	/** Event Id */
	event_id: number
	sender: UserDetails
	receiver: UserDetails
	/** Completed */
	completed: boolean
	/** Avg Rating */
	avg_rating?: number
	/** Task Completion */
	task_completion?: number
	/** Involvement */
	involvement?: number
	/** Motivation */
	motivation?: number
	/** Interaction */
	interaction?: number
	/** Achievements */
	achievements?: string
	/** Wishes */
	wishes?: string
	/** Remarks */
	remarks?: string
	/** Comment */
	comment?: string
}

/** FeedbackFromUser */
export interface FeedbackFromUser {
	/** Task Completion */
	task_completion: number
	/** Involvement */
	involvement: number
	/** Motivation */
	motivation: number
	/** Interaction */
	interaction: number
	/** Achievements */
	achievements?: string
	/** Wishes */
	wishes?: string
	/** Remarks */
	remarks?: string
	/** Comment */
	comment?: string
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

/** ShowSkillPromts */
export interface ShowSkillPromts {
	/** Id */
	id: number
	/** Name */
	name: string
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
	/**
	 * Date Of Birth
	 * @format date
	 */
	date_of_birth?: string
	/** Email */
	email?: string
	/** Full Name */
	full_name?: string
	/** Id */
	id: number
	avatar?: Avatar
}

/** UserCreate */
export interface UserCreate {
	/** Email */
	email: string
	/** Full Name */
	full_name: string
}

/** UserDetails */
export interface UserDetails {
	/** Id */
	id: number
	/** Full Name */
	full_name: string
	/** Job Title */
	job_title?: string
	avatar?: Avatar
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
	/**
	 * Date Of Birth
	 * @format date
	 */
	date_of_birth?: string
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
