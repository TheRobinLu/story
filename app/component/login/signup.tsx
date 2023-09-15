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
	signUp: string;
	verificationCode: string;
};

export default function Signup() {
	// const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [userVerficationCode, setUserVerificationCode] = useState("");
	const [isVerified, setIsVerified] = useState(false);
	const [verificationCodeSent, setVerificationCodeSent] = useState(false);
	const [signingUp, setSigningUp] = useState(false);
	const [verficationCodeSending, setVerficationCodeSending] = useState("");

	const [signUpError, setSignUpError] = useState<error>({
		username: "",
		email: "",
		password: "",
		passwordConfirmation: "",
		signUp: "",
		verificationCode: "",
	});

	const userExistsAPI = async ({
		username,
		email,
	}: {
		username: string;
		email: string;
	}): Promise<{ usernameError: string; emailError: string }> => {
		try {
			const userExistsResponse = await fetch("/api/user-exists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, email }),
			});
			const userExists = await userExistsResponse.json();
			if (userExists) {
				if (userExists.status == 201) {
					const ErrorMsg = userExists.message.toString();
					return { usernameError: ErrorMsg, emailError: "" };
				}

				if (userExists.status == 202) {
					const ErrorMsg = userExists.message.toString();
					return { usernameError: "", emailError: ErrorMsg };
				}
			}
		} catch (error) {
			if (error === "AbortError") {
				alert("Request was aborted");
			} else {
				alert("Error checking if user exists:" + error?.toString());
			}
		}
		return { usernameError: "", emailError: "" };
	};

	const userAddAPI = async ({
		username,
		email,
		password,
	}: {
		username: string;
		email: string;
		password: string;
	}): Promise<string> => {
		try {
			const userAddResponse = await fetch("/api/user-add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, email, password, active: false }),
			});
			const userAdd = await userAddResponse.json();

			if (userAdd.status !== 200) {
				const ErrorMsg = userAdd.message.toString();
				return ErrorMsg;
			} else {
				return "";
			}
		} catch (error) {
			if (error === "AbortError") {
				alert("Request was aborted");
			} else {
				alert("Error adding user:" + error?.toString());
			}
			return "Error adding user:" + error?.toString();
		}
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

	const activateUserAPI = async ({
		username,
		email,
	}: {
		username: string;
		email: string;
	}): Promise<string> => {
		const activateUserResponse = await fetch("/api/user-activate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email }),
		});
		const activateUser = await activateUserResponse.json();
		if (activateUser.status !== 200) {
			const ErrorMsg = activateUser.message.toString();
			return ErrorMsg;
		}
		return "";
	};

	const sendVerificationCode = async (): Promise<string> => {
		const verificationCode = await sendVerificationCodeAPI({ username, email });

		// check if the return is 6 digits number
		if (verificationCode.length !== 6 || isNaN(verificationCode)) {
			setSignUpError({
				...signUpError,
				verificationCode: "Verification Code is not valid",
			});
			return "Verification Code is not valid";
		}
		setVerificationCodeSent(true);
		setVerificationCode(verificationCode);

		return verificationCode;
	};

	const signUp = async () => {
		let validate: boolean = true;
		// setSignUpError({ ...signUpError, username: '', email: '', password: '', passwordConfirmation: '', verificationCode: '' })
		let newSignUpError = {
			username: "",
			email: "",
			password: "",
			passwordConfirmation: "",
			signUp: "",
			verificationCode: "",
		};
		if (username.length === 0) {
			newSignUpError.username = "Username is required";
			validate = false;
		}
		if (email.length === 0) {
			newSignUpError.email = "Email is required";
			validate = false;
		}

		if (email.length > 0 && (!email.includes("@") || !email.includes("."))) {
			newSignUpError.email = "Email is not valid";
			validate = false;
		}

		if (password.length === 0) {
			newSignUpError.password = "Password is required";
			validate = false;
		} else if (password.length < 6) {
			newSignUpError.password = "Password must be at least 6 charecters";
			validate = false;
		}

		if (passwordConfirmation.length === 0) {
			newSignUpError.passwordConfirmation = "Password Confirmation is required";
			validate = false;
		}
		if (password !== passwordConfirmation) {
			newSignUpError.passwordConfirmation =
				"Password Confirmation is not match";
			validate = false;
		}

		if (!validate) {
			setSignUpError({ ...newSignUpError });
			return;
		}

		const userExists = await userExistsAPI({ username, email });

		if (
			userExists.emailError.length > 0 ||
			userExists.usernameError.length > 0
		) {
			setSignUpError({
				...signUpError,
				username: userExists.usernameError,
				email: userExists.emailError,
			});
			return;
		}
		setSigningUp(true);
		setVerficationCodeSending(
			"VerficationCode is sending rto your email, please wait..."
		);
		sendVerificationCode();

		return;
	};

	const verifyUser = async () => {
		setVerficationCodeSending("");
		if (userVerficationCode.length === 0) {
			setSignUpError({
				...signUpError,
				verificationCode: "Verification Code is required",
			});
			return;
		}
		if (userVerficationCode.length !== 6) {
			setSignUpError({
				...signUpError,
				verificationCode: "Verification Code must be 6 digits",
			});
			return;
		}
		if (verificationCode !== userVerficationCode) {
			setSignUpError({
				...signUpError,
				verificationCode: "Verification Code is not match",
			});
			return;
		}

		const userAdd = await userAddAPI({ username, email, password });

		if (userAdd.length > 0) {
			setSignUpError({ ...signUpError, username: userAdd });
			return;
		}

		const activateUserResponse = await activateUserAPI({ username, email });

		if (activateUserResponse.length > 0) {
			setSignUpError({
				...signUpError,
				verificationCode: activateUserResponse,
			});
			return;
		}

		setIsVerified(true);
		setVerificationCodeSent(false);
		if (localStorage) {
			localStorage.setItem("LuluTalkingUser", username);
		}
		window.location.href = "/login";

		resetPage();
	};

	const resetPage = () => {
		setUsername("");
		setEmail("");
		setPassword("");
		setPasswordConfirmation("");
		setVerificationCode("");
		const newSignUpError = {
			username: "",
			email: "",
			password: "",
			passwordConfirmation: "",
			signUp: "Sign Up completed",
			verificationCode: "",
		};
		setSignUpError({ ...newSignUpError });
		setUserVerificationCode("");
		setVerificationCodeSent(false);
		setIsVerified(false);
		setVerificationCodeSent(false);
		setSigningUp(false);
	};

	return (
		<CenterPageFlex>
			<div className="w-full max-w-xs rounded-lg py-2 px-6 shadow-lg shadow-teal-800">
				<div id="SubscribeInfo" className="w-full">
					<div className="flex justify-center">
						<Image width={40} height={40} src="/lulu.png" alt="logo" />
					</div>

					<div className="text-2xl font-bold text-center text-teal-800">
						Sign Up
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
					{signUpError.username.length > 0 && (
						<div className="text-red-600 text-xs">{signUpError.username} </div>
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
					{signUpError.email.length > 0 && (
						<div className="text-red-600 text-xs">{signUpError.email} </div>
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
					{signUpError.password.length > 0 && (
						<div className="text-red-600 text-xs">{signUpError.password} </div>
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
					{signUpError.passwordConfirmation.length > 0 && (
						<div className="text-red-600 text-xs">
							{signUpError.passwordConfirmation}{" "}
						</div>
					)}
					<div className="pt-1"></div>
					<div className="text-green-600 text-xs">{verficationCodeSending}</div>
					<div className="mt-4">
						<button
							className="btn-teal m-2"
							disabled={signingUp}
							onClick={signUp}
						>
							{"Sign Up"}
						</button>
						<Link href="/">
							<button className="btn-teal m-2">{"Cancel"}</button>
						</Link>
					</div>
					{signUpError.signUp.length > 0 && (
						<div className="text-red-600 text-xs">{signUpError.signUp} </div>
					)}
					<div className="text-right text-xs text-teal-600 hover:text-teal-400">
						<Link href="/login"> {"I have an account"}</Link>
					</div>
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
							{signUpError.verificationCode.length > 0 && (
								<div className="text-red-600 text-xs">
									{signUpError.verificationCode}{" "}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</CenterPageFlex>
	);
}
