import { NextApiRequest, NextApiResponse } from "next";
import { Db, MongoClient } from "mongodb";
// import { FormValues } from "@/app/components/register";

import nodemailer from "nodemailer";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).json({ message: "Method Not Allowed" });
		return;
	}

	const { username, email, code } = req.body;

	// Create a Nodemailer transporter
	const transporter = nodemailer.createTransport({
		service: "hotmail",
		auth: {
			user: "lulu.talking@outlook.com",
			pass: process.env.EMAIL_PWD,
		},
	});

	// Send the verification code in an email
	try {
		await transporter.sendMail({
			from: "lulu.talking@outlook.com",
			to: email,
			subject: "Verification Code",
			text:
				`${username}: 您好! \n\n` +
				`您的 lulu Story 的验证码是 ${code}。. \n\n` +
				`请使用此代码验证您的电子邮件地址。\n\n 谢谢！ ` +
				`\n\n ------------------------------------------------------------\n\n` +
				`Hi, ${username}, \n\n` +
				`Your lulu Story verification code is ${code}. \n\n` +
				`Please use this code to verify your email address. \n\n` +
				`Thank You! \n\n`,
		});

		res.status(200).json({ status: 200, message: "Email sent" });
	} catch (err) {
		res.status(500).json({ status: 500, message: "Email not sent" });
	}
}
export default handler;
