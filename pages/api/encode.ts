import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "./utility/encode-decode";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log("==============encode.ts handler============== ");
	if (req.method !== "POST") {
		res.status(405).json({
			message: "Method Not Allowed",
		});
		return;
	}

	const { text } = req.body;
	const encodedText = await encode(text);

	res.status(200).json({ encodedText: encodedText });
}
