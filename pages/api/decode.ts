import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "./utility/encode-decode";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.status(405).json({
			message: "Method Not Allowed",
		});
		return;
	}

	const { text } = req.body;
	const decodedText = await decode(text);
	res.status(200).json({ decodedText: decodedText });
}
