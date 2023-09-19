import { NextApiRequest, NextApiResponse } from "next";
import {
	createUser,
	updateLoginDate,
	getUserRole,
	verifyPassword,
	updatePassword,
	findUser,
	activeUser,
	deactiveUser,
} from "./db-utility/user-dao";
import { user } from "@nextui-org/react";
import { IUser } from "@/app/interface/iUser";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
): void {
	const { method } = req;
	const { action } = req.body;
	console.log("=============API==================");
	if (method !== "POST") {
		res.status(405).json({ message: "Method Not Allowed" });
	}

	switch (action) {
		case "LOGIN":
			login({ req, res });
			return;
		case "LOGOUT":
			return;
		case "SIGNUP":
			signUp({ req, res });

			return;
		case "ACTIVATE":
			active({ req, res });
			return;
		case "DEACTIVATE":
			deactive({ req, res });
			return;
		case "CHANGEPWD":
			changePwd({ req, res });
			return;
		case "USEREXIST":
			userExist({ req, res });
			return;
		default:
			res.status(404).json({ message: "No Api for " + action + " found" });
			return;
	}
}

async function login({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username, password } = req.body;
	verifyPassword({ username: username.toLowerCase(), password }).then(
		(result) => {
			if (result) {
				updateLoginDate(username);
				getUserRole(username).then((role) => {
					res.status(200).json({ role });
				});
			} else {
				res.status(401).json({ message: "Unauthorized" });
			}
		}
	);
}

async function changePwd({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username, oldPassword, newPassword } = req.body;
	updatePassword(username.toLowerCase(), oldPassword, newPassword).then(
		(result) => {
			if (result) {
				res.status(200).json({ message: "OK" });
			} else {
				res.status(500).json({ message: "Internal Server Error" });
			}
		}
	);
}

async function signUp({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username, email, password, active } = req.body;

	const user = {
		username: username.toLowerCase(),
		email: email.toLowerCase(),
		password: password,
		role: "user",
		active: active,
		createDate: new Date(),
		updateDate: new Date(),
		lastLogin: new Date(),
	} as IUser;

	const insertedId = (await createUser(user)).toString();

	console.log("==============insertedId", insertedId);

	if (insertedId.length > 0) {
		res.status(200).json({ message: "" });
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
}

async function userExist({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	console.log("=============userExist==================");
	const { username, email } = req.body;
	const result = await findUser(username.toLowerCase(), email.toLowerCase());
	const { exist, message } = result;
	console.log("exist", exist);
	if (exist === true) {
		console.log("found message", message);
		res.status(201).json({ exist: true, message: message });
		return;
	} else {
		if (exist === false) {
			console.log("not found message");
			res.status(200).json({ exist: false });
			return;
		} else {
			res.status(500).json({ message: "Internal Server Error" });
			return;
		}
	}
}

async function active({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username } = req.body;
	const result = await activeUser(username.toLowerCase());

	console.log("activeUser result", result);
	if (result === "OK") {
		res.status(200).json({ message: "OK" });
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}

	return;
}

async function deactive({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const { username } = req.body;
	const result = await deactiveUser(username.toLowerCase());

	console.log("activeUser result", result);
	if (result === "OK") {
		res.status(200).json({ message: "OK" });
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}

	return;
}
