import { NextApiRequest, NextApiResponse } from "next";
import { GetStoryList } from "./db-utility/story-dao";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//console.log("==============story-list.ts handler============== ");
	const { method } = req;
	if (method !== "POST") {
		res.status(405).json({ message: "Method Not Allowed" });
		return;
	}

	const { username } = req.body;

	const storyList = await GetStoryList(username);

	//console.log(storyList);
	res.status(200).json({ storyList: storyList });
}
