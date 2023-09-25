import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { sessionUser, cookieUser } = req.body;

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("No secret defined");
	}
	const decoded: any = jwt.verify(cookieUser, secret) as JwtPayload;

	console.log("decoded: ", decoded);
	const decodedUser = decoded.origText;

	const username = atob(sessionUser);

	if (username.toLowerCase() === decodedUser.toLowerCase()) {
		res.status(200).json({ message: "true" });
		return;
	}
	res.status(400).json({ message: "false" });
}
