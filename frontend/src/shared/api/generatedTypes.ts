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

/** Body_reject_calendar_event_calendar__calendar_id__reject_post */
export interface BodyRejectCalendarEventCalendarCalendarIdRejectPost {
	/**
	 * Rejection Cause
	 * @default ""
	 */
	rejection_cause?: string
}

/** CalendarEvent */
export interface CalendarEvent {
	/** Id */
	id: number
	/** Owner Id */
	owner_id: number
	owner: UserDetails
	/** User Id */
	user_id: number
	user: UserDetails
	/** Title */
	title: string
	/** Description */
	description?: string
	/**
	 * Date Start
	 * @format date-time
	 */
	date_start: string
	/**
	 * Date End
	 * @format date-time
	 */
	date_end: string
	/** An enumeration. */
	status: CalendarEventStatus
	/** Rejection Cause */
	rejection_cause?: string
}

/** CalendarEventCreate */
export interface CalendarEventCreate {
	/** User Id */
	user_id: number
	/** Title */
	title: string
	/** Description */
	description?: string
	/**
	 * Date Start
	 * Event start datetime in UTC with timezone. Example: '2023-02-26T12:30:00Z'
	 * @format date-time
	 */
	date_start: string
	/**
	 * Date End
	 * Event end datetime in UTC with timezone. Example: '2023-02-26T12:30:00Z'
	 * @format date-time
	 */
	date_end: string
}

/** CalendarEventReshedule */
export interface CalendarEventReshedule {
	/**
	 * Date Start
	 * Event start datetime in UTC
	 * @format date-time
	 */
	date_start?: string
	/**
	 * Date End
	 * Event end datetime in UTC
	 * @format date-time
	 */
	date_end?: string
}

/**
 * CalendarEventStatus
 * An enumeration.
 */
export enum CalendarEventStatus {
	Pending = 'pending',
	Accepted = 'accepted',
	Rejected = 'rejected',
	Resheduled = 'resheduled',
}

/** CalendarEventUpdate */
export interface CalendarEventUpdate {
	/** User Id */
	user_id?: number
	/** Title */
	title?: string
	/** Description */
	description?: string
	/**
	 * Date Start
	 * Event start datetime in UTC
	 * @format date-time
	 */
	date_start?: string
	/**
	 * Date End
	 * Event end datetime in UTC
	 * @format date-time
	 */
	date_end?: string
}

/**
 * CalendarFormat
 * An enumeration.
 */
export enum CalendarFormat {
	Day = 'day',
	Week = 'week',
	Month = 'month',
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

/** ColleagueRating */
export interface ColleagueRating {
	/** Feedback Id */
	feedback_id: number
	colleague: UserDetails
	/** Avg Rating */
	avg_rating?: number
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

/** FeedbackStat */
export interface FeedbackStat {
	user: UserDetails
	/** Avg Rating */
	avg_rating?: number
	/** Task Completion Avg */
	task_completion_avg?: number
	/** Involvement Avg */
	involvement_avg?: number
	/** Motivation Avg */
	motivation_avg?: number
	/** Interaction Avg */
	interaction_avg?: number
	/** Colleagues Rating */
	colleagues_rating?: ColleagueRating[]
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
	description: 'employee' | 'trainee' | 'mentor' | 'manager' | 'hr' | 'boss' | 'admin'
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
	/**
	 * Work Hours Start
	 * Start of work in Ekaterinburg time
	 * @format time
	 */
	work_hours_start?: string
	/**
	 * Work Hours End
	 * End of work in Ekaterinburg time
	 * @format time
	 */
	work_hours_end?: string
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
	/**
	 * Work Hours Start
	 * Start of work in Ekaterinburg time
	 * @format time
	 */
	work_hours_start?: string
	/**
	 * Work Hours End
	 * End of work in Ekaterinburg time
	 * @format time
	 */
	work_hours_end?: string
	/** Job Title */
	job_title?: string
	/** Roles */
	roles?: ('employee' | 'trainee' | 'mentor' | 'manager' | 'hr' | 'boss' | 'admin')[]
	/** Facts */
	facts?: string[]
	/** Skills */
	skills?: string[]
	/** Job Expectations */
	job_expectations?: string[]
	/** Work Format */
	work_format?: 'home' | 'office' | 'part'
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
