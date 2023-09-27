import { IDBStory, IStory } from "@/app/interface/iStory";
import { MongoClient, Db, ObjectId } from "mongodb";

async function connectToDatabase(): Promise<MongoClient> {
	const client = await MongoClient.connect(`${process.env.MONGODB_URL}`, {});
	return client;
}

export async function SaveStory(newStory: IStory) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");

	const result = await collection.insertOne(newStory);
	client.close();
	return result;
}

export async function UpdateStory({
	id,
	story,
}: {
	id: string;
	story: IStory;
}) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");

	const origStory = await collection.findOne({ _id: new ObjectId(id) });
	console.log("origStory: ", origStory);

	if (!origStory) {
		SaveStory(story);
		return null;
	} else {
		const newStory: IStory = {
			title: story.title,
			author: story.author,
			createDate: origStory.createDate,
			updateDate: new Date(),
			summary: story.summary,
			content: story.content,
			editing: false,
			username: story.username,
		};
		console.log("newStory: ", newStory);
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: newStory }
		);
		client.close();
		return result;
	}
}

export async function GetStory(storyId: any) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const story = (await collection.findOne({
		_id: new ObjectId(storyId),
	})) as IDBStory;

	const sortedContent = story.content.sort((a, b) => {
		return a.sequence - b.sequence;
	});

	const retStory = { ...story, content: sortedContent };
	client.close();
	return retStory;
}

export async function GetStoryList(username: string) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	//Project to _id, title, author, createDate, updateDate, summary
	//console.log("==================GetStoryList==================");
	const storyList = await collection
		.find({ username: username })
		.project({
			_id: 1,
			title: 1,
			author: 1,
			createDate: 1,
			updateDate: 1,
			summary: 1,
			username: 1,
		})
		.sort({ updateDate: -1 })
		.toArray();
	//console.log(storyList);
	client.close();
	return storyList;
}

export async function DeleteStory(id: any) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const result = await collection.deleteOne({ _id: new ObjectId(id) });
	client.close();
	return result;
}

export async function DeleteAllStory() {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const result = await collection.deleteMany({});
	client.close();
	return result;
}

export async function GetStoryListByAuthor(author: string) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const storyList = await collection.find({ author: author }).toArray();
	client.close();
	return storyList;
}

export async function GetStoryListByTitle(title: string) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const storyList = await collection.find({ title: title }).toArray();
	client.close();
	return storyList;
}

export async function InsertChapter(
	sequence: number,
	subTitle: string,
	content: string
) {
	const client = await connectToDatabase();
	const db = client.db();
	const collection = db.collection("story");
	const result = await collection.insertOne({ sequence, subTitle, content });
	client.close();
	return result;
}
