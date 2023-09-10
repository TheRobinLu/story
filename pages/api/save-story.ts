import { NextApiRequest, NextApiResponse } from "next";
import { SaveStory, UpdateStory } from "./db-utility/story-dao";
import { IDBStory, IStory } from "@/app/interface/iStory";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	const {id, story} = req.body;
	switch (method) {
		case "POST":
			await SaveStory(story);
			res.status(200).json({ status: "success" });
			break;
		case "PUT":
			await UpdateStory({id, story});
			
			res.status(200).json({ status: "success" });
			break;
		default:
			res.setHeader("Allow", ["POST", "PUT"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
