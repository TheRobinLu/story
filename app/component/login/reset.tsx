"use client";
import CenterPageFlex from "../CenterPageFlex";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";

type error = {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	reset: string;
	verificationCode: string;
};

export default function Reset() {
	// const router = useRouter();
	const noError: error = {
		username: "",
		email: "",
		password: "",
		passwordConfirmation: "",
		reset: "",
		verificationCode: "",
	};
	const [username, setUsername] = useState("");
	let [hidenUsername, setHidenUsername] = useState("");
	const [email, setEmail] = useState("");
	let [hidenEmail, setHidenEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [userVerficationCode, setUserVerificationCode] = useState("");
	const [isVerified, setIsVerified] = useState(false);
	const [verificationCodeSent, setVerificationCodeSent] = useState(false);

	const [resetError, setResetError] = useState<error>({ ...noError });

	const userFindAPI = async ({
		username,
		email,
	}: {
		username: string;
		email: string;
	}): Promise<boolean> => {
		try {
			const userFindResponse = await fetch("/api/user-find", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, email }),
			});
			const userFind = await userFindResponse.json();
			if (userFind) {
				if (userFind.status == 200) {
					hidenUsername = userFind.username;
					hidenEmail = userFind.email;
					setHidenUsername(userFind.username);
					setHidenEmail(userFind.email);
					return true;
				} else {
					let newError: error = { ...noError };
					newError.reset = userFind.message;
					setResetError({ ...newError });
				}
			}
		} catch (error) {
			if (error === "AbortError") {
				alert("Request was aborted");
			} else {
				alert("Error checking if user exists:" + error?.toString());
			}
		}
		return false;
	};

	const sendVerificationCodeAPI = async ({
		username,
		email,
	}: {
		username: string;
		email: string;
	}) => {
		const code = Math.floor(Math.random() * 900000)
			.toString()
			.padStart(6, "0");

		try {
			const sendVerificationCodeResponse = await fetch(
				"/api/send-verification-code",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, email, code }),
				}
			);
			const sendVerificationCode = await sendVerificationCodeResponse.json();

			if (sendVerificationCode.status !== 200) {
				const ErrorMsg = sendVerificationCode.message.toString();
				return ErrorMsg;
			}
			return code;
		} catch (error) {
			if (error === "AbortError") {
				alert("Request was aborted");
			} else {
				alert("Error sending verification code:" + error?.toString());
			}
			return "Error sending verification code:" + error?.toString();
		}
	};

	async function resetPasswordAPI({
		username,
		password,
	}: {
		username: string;
		password: string;
	}): Promise<string> {
		try {
			const resetPasswordResponse = await fetch("/api/user-reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});
			const resetPassword = await resetPasswordResponse.json();

			if (resetPassword.status !== 200) {
				const ErrorMsg = resetPassword.message.toString();
				return ErrorMsg;
			}
			return "";
		} catch (error) {
			if (error === "AbortError") {
				alert("Request was aborted");
			} else {
				alert("Error reset password:" + error?.toString());
			}
			return "Error reset password:" + error?.toString();
		}
	}

	const sendVerificationCode = async (): Promise<string> => {
		const verificationCode = await sendVerificationCodeAPI({
			username: hidenUsername,
			email: hidenEmail,
		});

		// check if the return is 6 digits number
		if (verificationCode.length !== 6 || isNaN(verificationCode)) {
			setResetError({
				...resetError,
				verificationCode: "Verification Code is not valid",
			});
			return "Verification Code is not valid";
		}
		setVerificationCodeSent(true);
		setVerificationCode(verificationCode);

		return verificationCode;
	};

	const ResetPasseord = async () => {
		let validate: boolean = true;
		let newResetError = { ...noError };
		if (username.length === 0 && email.length === 0) {
			newResetError.email = "Username or email is required";
			validate = false;
		}

		if (email.length > 0 && (!email.includes("@") || !email.includes("."))) {
			newResetError.email = "Email is not valid";
			validate = false;
		}

		if (password.length === 0) {
			newResetError.password = "Password is required";
			validate = false;
		} else if (password.length < 6) {
			newResetError.password = "Password must be at least 6 charecters";
			validate = false;
		}

		if (passwordConfirmation.length === 0) {
			newResetError.passwordConfirmation = "Password Confirmation is required";
			validate = false;
		}
		if (password !== passwordConfirmation) {
			newResetError.passwordConfirmation = "Password Confirmation is not match";
			validate = false;
		}

		if (!validate) {
			setResetError({ ...newResetError });
			return;
		}

		hidenEmail = "";
		hidenUsername = "";
		const found = await userFindAPI({ username, email });

		if (found) {
			const verificationCode = await sendVerificationCode();
		}

		return;
	};

	const verifyUser = async () => {
		if (userVerficationCode.length === 0) {
			setResetError({
				...resetError,
				verificationCode: "Verification Code is required",
			});
			return;
		}
		if (userVerficationCode.length !== 6) {
			setResetError({
				...resetError,
				verificationCode: "Verification Code must be 6 charecters",
			});
			return;
		}
		if (verificationCode !== userVerficationCode) {
			setResetError({
				...resetError,
				verificationCode: "Verification Code is not match",
			});
			return;
		}

		const ok = await resetPasswordAPI({
			username: hidenUsername,
			password: password,
		});

		if (ok.length === 0) {
			setIsVerified(true);
			setVerificationCodeSent(false);
			window.location.href = "/login";
		} else {
			setResetError({ ...resetError, verificationCode: ok });
			return;
		}

		resetPage();
	};

	const resetPage = () => {
		setUsername("");
		setEmail("");
		setPassword("");
		setPasswordConfirmation("");
		setVerificationCode("");
		const newResetError = {
			username: "",
			email: "",
			password: "",
			passwordConfirmation: "",
			reset: "Reset password completed",
			verificationCode: "",
		};
		setResetError({ ...newResetError });
		setUserVerificationCode("");
		setVerificationCodeSent(false);
		setIsVerified(false);
		setVerificationCodeSent(false);
	};

	// const Cancel = () => {

	// }

	return (
		<CenterPageFlex>
			<div className="w-full max-w-xs rounded-lg p-6 shadow-lg shadow-teal-800">
				<div id="SubscribeInfo" className="w-full">
					<div className="flex justify-center">
						<Image width={40} height={40} src="/lulu.png" alt="logo" />
					</div>

					<div className="text-xl font-bold text-center text-teal-800">
						Reset Password
					</div>
					<div className="text-xs text-center text-teal-400">
						You can username or email to reset your password
					</div>

					<input
						type="text"
						name="username"
						value={username}
						onChange={(event: any) => {
							setUsername(event.target.value);
						}}
						placeholder={"User Name"}
						className="w-full bg-sky-100 mx-1 mt-2 border-2 border-teal-600 p-1 rounded"
					></input>
					{resetError.username.length > 0 && (
						<div className="text-red-600 text-xs">{resetError.username} </div>
					)}

					<input
						type="text"
						name="email"
						value={email}
						onChange={(event: any) => {
							setEmail(event.target.value);
						}}
						placeholder={"Email"}
						className="w-full bg-sky-100 mx-1  mt-2 border-2 border-teal-600 p-1 rounded"
					></input>
					{resetError.email.length > 0 && (
						<div className="text-red-600 text-xs">{resetError.email} </div>
					)}

					<input
						type="password"
						name="password"
						value={password}
						onChange={(event: any) => {
							setPassword(event.target.value);
						}}
						placeholder={"Password"}
						className="w-full bg-sky-100 mx-1  mt-2 border-2 border-teal-600 p-1 rounded"
					></input>
					{resetError.password.length > 0 && (
						<div className="text-red-600 text-xs">{resetError.password} </div>
					)}

					<input
						type="password"
						name="passwordConfirmation"
						value={passwordConfirmation}
						onChange={(event: any) => {
							setPasswordConfirmation(event.target.value);
						}}
						placeholder={"Password Confirmation"}
						className="w-full bg-sky-100 mx-1  mt-2 border-2 border-teal-600 p-1 rounded"
					></input>
					{resetError.passwordConfirmation.length > 0 && (
						<div className="text-red-600 text-xs">
							{resetError.passwordConfirmation}{" "}
						</div>
					)}
					<div className="mt-4">
						<button className="btn-teal m-2" onClick={ResetPasseord}>
							Reset
						</button>
						<Link href="/">
							<button className="btn-teal m-2">Cancel</button>
						</Link>
					</div>
					{resetError.reset.length > 0 && (
						<div className="text-red-600 text-xs">{resetError.reset} </div>
					)}
				</div>

				{verificationCodeSent && (
					<div id="Verification" className="w-full max-w-xs">
						<hr className="border-teal-600 m-3 shadow-lg  shadow-neutral-500 "></hr>
						<div className="text-2xl font-bold text-center text-teal-800">
							{"Verification"}
						</div>

						<div className="w-full">
							<input
								type="text"
								name="userVerificationCode"
								value={userVerficationCode}
								onChange={(event: any) => {
									setUserVerificationCode(event.target.value);
								}}
								placeholder={"Verification Code"}
								className="w-24 bg-sky-100 mx-1  mt-2 border-2 border-teal-600 p-1 rounded"
							></input>
							<button
								className="btn-teal text-xs m-2"
								onClick={sendVerificationCode}
							>
								{"Resend"}
							</button>
						</div>
						<button className="btn-teal m-2" onClick={verifyUser}>
							{"Verify"}
						</button>
						<div>
							{resetError.verificationCode.length > 0 && (
								<div className="text-red-600 text-xs">
									{resetError.verificationCode}{" "}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</CenterPageFlex>
	);
}
