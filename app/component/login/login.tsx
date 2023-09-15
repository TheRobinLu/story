"use client";
import CenterPageFlex from "../CenterPageFlex";
import Image from "next/image";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { Session } from "inspector";
import Link from "next/link";

export default function LogIn() {
	const [language, setLanguage] = useState("en");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const loginAPI = async () => {
		const loginResponse = await fetch("/api/user-login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});
		const login = await loginResponse.json();

		if (login.status !== 200) {
			const ErrorMsg = login.message.toString();
			return ErrorMsg;
		} else {
			sessionStorage.setItem("userToken", login.token);
			sessionStorage.setItem("pageUser", username);
			sessionStorage.sessionUser = username;
		}
		return "";
	};

	const handleLogin = async (event: any) => {
		event.preventDefault();
		const loginResponse = await loginAPI();

		if (loginResponse !== "") {
			alert(loginResponse);
			return;
		}
		if (localStorage) {
			localStorage.LuluTalkingUser = username;
		}

		//ge page go back url
		const currentUrl = document.location.href;
		if (currentUrl.includes("login")) {
			const previousUrl = document.referrer;
			if (previousUrl.includes("signup") || previousUrl.includes("login")) {
				window.location.href = "/chat";
			} else {
				window.location.href = "/";
			}
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
	//<input onKeyDown={handleKeyDown} />
	return (
		<CenterPageFlex>
			<div className="w-full max-w-xs rounded-lg py-3 px-6 shadow-lg shadow-teal-800">
				<div className="flex justify-center">
					<Image width={40} height={40} src="/lulu.png" alt="logo" />
				</div>
				<div className="text-2xl font-bold text-center text-teal-800">
					{"Log In"}
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
				<input
					type="password"
					name="password"
					value={password}
					onChange={(event: any) => {
						setPassword(event.target.value);
					}}
					onKeyDown={handleKeyDown}
					placeholder={"Password"}
					className="w-full bg-sky-100 mx-1  mt-2 border-2 border-teal-600 p-1 rounded"
				></input>

				<div className="flex justify-items-stretch mt-6">
					<button className="btn-teal m-2" onClick={handleLogin}>
						{"Log In"}
					</button>
					<Link href="/">
						<button className="btn-teal m-2">{"Cancel"}</button>
					</Link>
				</div>

				<div className="m-4 text-right text-xs text-teal-800 hover:text-teal-600 ">
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
