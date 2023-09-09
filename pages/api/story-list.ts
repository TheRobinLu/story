import { NextApiRequest, NextApiResponse } from "next";
import { GetStoryList } from "./db-utility/story-dao";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//console.log("==============story-list.ts handler============== ");
	const storyList = await GetStoryList();

	//console.log(storyList);
	res.status(200).json({ storyList: storyList });
}
