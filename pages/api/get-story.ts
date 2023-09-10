import { NextApiRequest, NextApiResponse } from "next";
import { GetStory } from "./db-utility/story-dao";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log("==============get-story.ts handler============== ");
	if (req.method !== "POST") {
		res.status(405).json({
			message: "Method Not Allowed",
		});
		return;
	}

	const { storyId } = req.body;
	// console.log("storyId: ", storyId);
	const story = await GetStory(storyId);
	res.status(200).json({ story: story });
}
