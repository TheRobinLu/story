import { IDBUser, IUser } from "@/app/interface/iUser";
import { MongoClient, Db, ObjectId } from "mongodb";
import { hashPassword } from "../utility/hash-password";

async function connectToDatabase(): Promise<MongoClient> {
	const client = await MongoClient.connect(`${process.env.MONGODB_URL}`, {});
	return client;
}

export async function createUser(user: IUser): Promise<string> {
	const client = await connectToDatabase();
	const db = client.db();
	const hashedPassword = await hashPassword(user.password);
	console.log("hashedPassword", hashedPassword);
	const hassedUser = { ...user, password: hashedPassword };
	console.log("hassedUser", hassedUser);
	const result = await db.collection("storyUser").insertOne(hassedUser);
	console.log("result", result);
	client.close();

	if (result.acknowledged && result.insertedId) {
		return result.insertedId as unknown as string;
	}

	return "";
}

export async function getUserRole(username: string): Promise<string> {
	const client = await connectToDatabase();
	const db = client.db();
	const result = (await db
		.collection("storyUser")
		.findOne({ username: username })) as IDBUser;
	client.close();
	if (!result) {
		return "";
	}
	return result.role;
}

export async function verifyPassword({
	username,
	password,
}: {
	username: string;
	password: string;
}): Promise<Boolean> {
	const client = await connectToDatabase();
	const db = client.db();
	const result = (await db
		.collection("storyUser")
		.findOne({ username: username })) as IDBUser;
	client.close();
	if (!result) {
		return false;
	}
	const hashedPassword = await hashPassword(password as string);
	return hashedPassword === result.password;
}

export async function updateLoginDate(username: string): Promise<string> {
	const client = await connectToDatabase();
	const db = client.db();
	const result = await db
		.collection("storyUser")
		.updateOne({ username: username }, { $set: { lastLogin: new Date() } });
	client.close();
	if (!result.acknowledged) {
		return "OK";
	}
	return "";
}

export async function updatePassword(
	username: string,
	oldPassword: string,
	newPassword: string
): Promise<string> {
	const client = await connectToDatabase();
	const db = client.db();
	const hashedOldPassword = await hashPassword(oldPassword);
	const hashedNewPassword = await hashPassword(newPassword);
	const result = await db
		.collection("storyUser")
		.updateOne(
			{ username: username, password: hashedOldPassword },
			{ $set: { password: hashedNewPassword, updateDate: new Date() } }
		);
	client.close();
	if (!result.acknowledged && result.modifiedCount == 1) {
		return "OK";
	}
	return "";
}

export async function findUser(username: string, email: string): Promise<any> {
	const client = await connectToDatabase();
	const db = client.db();
	const byUsername = await db
		.collection("storyUser")
		.findOne({ username: username });
	//client.close();

	console.log("byUsername", byUsername);
	if (!byUsername) {
		const byEmail = await db
			.collection("storyUser")
			.findOne({ username: username });
		client.close();
		if (byEmail) {
			return { exist: true, message: "Email duplicated" };
		} else {
			return { exist: false };
		}
	}
	client.close();
	return { exist: true, message: "Username duplicated" };
}

export async function activeUser(username: string): Promise<any> {
	const client = await connectToDatabase();
	const db = client.db();
	const result = await db
		.collection("storyUser")
		.updateOne({ username: username }, { $set: { active: true } });
	client.close();
	if (result.acknowledged) {
		return "OK";
	}
	return "";
}

export async function deactiveUser(username: string): Promise<any> {
	const client = await connectToDatabase();
	const db = client.db();
	const result = await db
		.collection("storyUser")
		.updateOne({ username: username }, { $set: { active: false } });

	client.close();
	if (result.acknowledged) {
		return "OK";
	}
	return "";
}
