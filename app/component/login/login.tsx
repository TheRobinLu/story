"use client";
import CenterPageFlex from "../CenterPageFlex";
import Image from "next/image";
import { Input } from "@nextui-org/react";
import { Password } from "../password";
import { PurpleGradientButton } from "../button";
import { KeyboardEventHandler, useEffect, useState, useRef } from "react";
import { Session } from "inspector";
import Link from "next/link";
import { setCookie, getCookie } from "cookies-next";

export default function LogIn() {
	const [username, setUsername] = useState("");
	const [userRole, setUserRole] = useState("user");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	let newRole = userRole;

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

		if (loginResponse.status !== 200) {
			const ErrorMsg = login.message?.toString();
			return ErrorMsg;
		} else {
			const role = login.role;
			setUserRole(role);
			newRole = role;
			//alert("user role: " + newRole.toString());
			return "";
		}
	};

	const handleLogin = async () => {
		const loginResponse = await loginAPI();
		//alert("user role at handleLogin: " + newRole.toString());
		if (loginResponse !== "") {
			alert(loginResponse);
			return;
		}

		//set sessionStorage user role
		sessionStorage.setItem("userRole", btoa(newRole));
		sessionStorage.setItem("username", btoa(username));

		//update cookie
		await fetch("/api/encode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: username }),
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					const encodeUsername = data.encodedText;

					setCookie("LuluStoryUser", encodeUsername, {
						maxAge: 86400,
						path: "/",
					});
				});
			}
		});

		//get page go back url
		const currentUrl = document.location.href;
		if (currentUrl.includes("login")) {
			window.location.href = "/";
		} else {
			window.location.reload();
		}

		return;
	};

	//How to trigger handleKeyDown
	//<Input onKeyDown={handleKeyDown} />
	return (
		<CenterPageFlex>
			<div className="w-full max-w-xs rounded-lg py-3 px-6 shadow-lg shadow-blue-800">
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
						<PurpleGradientButton onPress={handleLogin}>
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
