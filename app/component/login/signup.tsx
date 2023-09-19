"use client";
import CenterPageFlex from "../CenterPageFlex";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@nextui-org/react";

import { useEffect } from "react";
import Link from "next/link";
import { Password } from "../password";

import { PurpleGradientButton } from "../button";

type error = {
	username: string;
	email: string;
	password: string;
	signUp: string;
	verificationCode: string;
};

export default function Signup() {
	// const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
			const userExistsResponse = await fetch("/api/user-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ action: "USEREXIST", username, email }),
			});
			const { exist, message } = await userExistsResponse.json();
			if (exist) {
				if (userExistsResponse.status == 201) {
					const ErrorMsg = message.toString();
					if (ErrorMsg.toLowerCase().includes("username")) {
						return { usernameError: ErrorMsg, emailError: "" };
					} else {
						return { usernameError: "", emailError: ErrorMsg };
					}
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
		const action = "SIGNUP";
		try {
			const userAddResponse = await fetch("/api/user-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action,
					username,
					email,
					password,
					active: false,
				}),
			});
			const userAdd = await userAddResponse.json();

			if (userAddResponse.status !== 200) {
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
	}: {
		username: string;
	}): Promise<string> => {
		const activateUserResponse = await fetch("/api/user-api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ action: "ACTIVATE", username }),
		});
		const activateUser = await activateUserResponse.json();
		if (activateUserResponse.status !== 200) {
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
			signUp: "",
			verificationCode: "",
		};
		if (username.length === 0) {
			newSignUpError.username = "Username is required";
			validate = false;
		}

		if (username.length < 4) {
			newSignUpError.username = "Username must be at least 4 charecters";
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
		} else if (password.length < 8) {
			newSignUpError.password = "Password must be at least 8 charecters";
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
			"VerficationCode is sending to your email, please wait..."
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

		const activateUserResponse = await activateUserAPI({ username });

		if (activateUserResponse.length > 0) {
			setSignUpError({
				...signUpError,
				verificationCode: activateUserResponse,
			});
			return;
		}

		setIsVerified(true);
		setVerificationCodeSent(false);
		resetPage();
		alert("Sign Up completed");
		window.location.href = "/login";
	};

	const resetPage = () => {
		setUsername("");
		setEmail("");
		setPassword("");
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
			<div className="w-full max-w-xs rounded-lg py-2 px-6 shadow-lg shadow-blue-800">
				<div id="SubscribeInfo" className="w-full">
					<div className="flex justify-center ">
						<Image
							width={40}
							height={60}
							src="/logo.svg"
							alt="logo"
							className=" rounded-lg shadow-lg shadow-purple-100"
						/>
					</div>

					<div className="text-2xl font-bold text-center text-blue-700">
						Sign Up
					</div>
					<Input
						className="p-1"
						// variant="underlined"
						errorMessage={signUpError.username}
						color="primary"
						radius="sm"
						size="sm"
						onChange={(event: any) => {
							setUsername(event.target.value);
						}}
						placeholder={"User Name"}
					></Input>

					<Input
						className="p-1"
						// variant="underlined"
						errorMessage={signUpError.email}
						color="primary"
						radius="sm"
						size="sm"
						value={email}
						onChange={(event: any) => {
							setEmail(event.target.value);
						}}
						placeholder={"Email"}
					></Input>

					<Password
						errorMessage={signUpError.password}
						onChange={(event: any) => {
							setPassword(event.target.value);
						}}
					></Password>

					<div className="pt-1"></div>
					<div className="text-green-600 text-xs">{verficationCodeSending}</div>
					<div className="flex mt-4">
						<div className="mx-1">
							<PurpleGradientButton onPress={signUp}>
								Sign Up
							</PurpleGradientButton>
						</div>
						<div className="mx-1">
							<Link href="/">
								<PurpleGradientButton
									onPress={() => {
										return;
									}}
								>
									Cancel
								</PurpleGradientButton>
							</Link>
						</div>
					</div>

					<div className="text-right text-xs text-blue-700 hover:text-blue-500">
						<Link href="/login"> I have an account</Link>
					</div>
				</div>

				{verificationCodeSent && (
					<div id="Verification" className="w-full max-w-xs">
						<hr className="border-blue-600 m-3 shadow-lg  shadow-neutral-500 "></hr>
						<div className="text-2xl font-bold text-center text-blue-700 p-1">
							{"Verification"}
						</div>

						<div className="flex w-full pt-1 ">
							<Input
								errorMessage={signUpError.verificationCode}
								color="primary"
								type="number"
								radius="sm"
								size="sm"
								onChange={(event: any) => {
									setUserVerificationCode(event.target.value);
								}}
								placeholder={"Verification Code"}
								className="p-1 w-3/4"
							></Input>
							<div className="p-1">
								<PurpleGradientButton onPress={sendVerificationCode}>
									{"Resend"}
								</PurpleGradientButton>
							</div>
						</div>

						<div className="p-1">
							<PurpleGradientButton onPress={verifyUser}>
								{"Verify"}
							</PurpleGradientButton>
						</div>
					</div>
				)}
			</div>
		</CenterPageFlex>
	);
}
