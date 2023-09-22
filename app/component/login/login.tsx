"use client";
import CenterPageFlex from "../CenterPageFlex";
import Image from "next/image";
import { Input } from "@nextui-org/react";
import { Password } from "../password";
import { PurpleGradientButton } from "../button";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { Session } from "inspector";
import Link from "next/link";
import { getCookie } from "cookies-next";

export default function LogIn() {
	const [language, setLanguage] = useState("en");
	const [username, setUsername] = useState("");
	const [userRole, setUserRole] = useState("user");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	useEffect(() => {
		const cookieUser = getCookie("LuluStoryUser");
		if (cookieUser) {
			fetch("/api/decode", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: cookieUser }),
			}).then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						setUsername(data.decodedText);
					});
				}
			});
		}
	}, []);

	const loginAPI = async () => {
		const loginResponse = await fetch("/api/user-api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ action: "LOGIN", username, password }),
		});
		const login = await loginResponse.json();

		if (login.status !== 200) {
			const ErrorMsg = login.message.toString();
			return ErrorMsg;
		} else {
			const role = login.role;
			setUserRole(role);

			return "";
		}
	};

	const handleLogin = async (event: any) => {
		event.preventDefault();
		const loginResponse = await loginAPI();

		if (loginResponse !== "") {
			alert(loginResponse);
			return;
		}

		//ge page go back url
		const currentUrl = document.location.href;
		if (currentUrl.includes("login")) {
			window.location.href = "/";
		} else {
			window.location.reload();
		}

		return;
	};

	//when key is enter, login
	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (
		event
	) => {
		if (event.key === "Enter") {
			await handleLogin(event);
		}
	};

	//How to trigger handleKeyDown
	//<Input onKeyDown={handleKeyDown} />
	return (
		<CenterPageFlex>
			<div className="w-full max-w-xs rounded-lg py-3 px-6 shadow-lg shadow-teal-800">
				<div className="flex justify-center">
					<Image
						width={40}
						height={60}
						src="/logo.svg"
						alt="logo"
						className=" rounded-lg shadow-lg shadow-purple-100"
					/>
				</div>
				<div className="text-2xl font-bold text-center text-blue-700 drop-shadow-sm ">
					{"Log In"}
				</div>

				<Input
					className="p-1"
					// variant="underlined"
					value={username}
					color="primary"
					radius="sm"
					size="sm"
					onChange={(event: any) => {
						setUsername(event.target.value);
					}}
					placeholder={"User Name"}
				></Input>
				<Password
					errorMessage={passwordError}
					onChange={(event: any) => {
						setPassword(event.target.value);
					}}
				></Password>

				<div className="flex justify-items-stretch mt-6">
					<div className="p-1">
						<PurpleGradientButton onPress={() => handleLogin}>
							{"Log In"}
						</PurpleGradientButton>
					</div>
					<Link href="/" className="p-1">
						<PurpleGradientButton
							onPress={() => {
								return;
							}}
						>
							{"Cancel"}
						</PurpleGradientButton>
					</Link>
				</div>

				<div className="m-4 text-right text-xs text-blue-700 hover:text-blue-500 ">
					<Link href="/signup">
						<button className=" mx-3 text-sm text-right">{"New User"}</button>
					</Link>
					<Link href="/reset">
						<button className=" ml-3 text-sm text-right">
							{"Forget Password"}
						</button>
					</Link>
				</div>
			</div>
		</CenterPageFlex>
	);
}
