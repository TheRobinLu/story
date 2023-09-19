import { ObjectId } from "mongodb";
export enum UserRole {
	ADMIN = "admin",
	USER = "user",
	EDITOR = "editor",
}

export interface IUser {
	username: string;
	email: string;
	password: string;
	role: UserRole;
	active: boolean;
	createDate: Date;
	updateDate: Date;
	lastLogin: Date;
}

export interface IDBUser extends IUser {
	_id: ObjectId | null;
}
