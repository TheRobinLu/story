import jwt, { JwtPayload } from "jsonwebtoken";

export function encode(origText: string) {
	const key = process.env.JWT_SECRET as string;
	const encodedText = jwt.sign({ origText: origText }, key);
	return encodedText;
}

export function decode(encodedText: string) {
	const key = process.env.JWT_SECRET as string;
	const decodedText = jwt.verify(encodedText, key) as JwtPayload;
	return decodedText.origText;
}
