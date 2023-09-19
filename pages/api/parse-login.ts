import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username, _lli } = req.body;
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("No secret defined");
	}
	const decoded: any = jwt.verify(_lli, secret) as JwtPayload;
	const { cookieUsername, cookieLogin } = decoded.json();

	if (username === cookieUsername && cookieLogin === true) {
		res.status(200).json({ message: "true" });
		return;
	}
	res.status(200).json({ message: "false" });
}
