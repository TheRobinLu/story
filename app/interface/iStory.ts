import { ObjectId } from "mongodb";

export interface IChapter {
	sequence: number;
	subTitle: string;
	content: string;
	updateDate: Date;
	editing: boolean;
}

export interface IStory {
	title: string;
	author: string;
	createDate: Date;
	updateDate: Date;
	summary: string;
	content: IChapter[];
	editing: boolean;
	username: string;
}

export interface IDBStoryList {
	_id: ObjectId | null;
	title: string;
	author: string;
	createDate: Date;
	updateDate: Date;
	summary: string;
}

export interface IDBStory extends IStory {
	_id: ObjectId | null;
}
