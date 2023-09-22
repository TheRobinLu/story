"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { cookies } from "next/headers";

import { setCookie, getCookie } from "cookies-next";

export default function Header() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		//get LuluStoryUser from cookie
		const LuluStoryUser = getCookie("LuluStoryUser");
		console.log("LuluStoryUser:", LuluStoryUser);
		if (LuluStoryUser) {
			setIsSignUp(true);
		}

		const a = setCookie("test", "test11111");
		const b = getCookie("test");
		console.log("b:", b);

		setCookie("test", "test2220");
		const c = getCookie("test");
		console.log("c:", c);

		const LuluStoryLogin = getCookie("_lli");

		if (!LuluStoryUser || !LuluStoryLogin) {
			return;
		}

		fetch("/api/parse-login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: LuluStoryUser, _lli: LuluStoryLogin }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === "true") {
					setIsLogin(true);
				}
			})
			.catch((err) => {
				console.log("err", err);
			});
	}, []);

	function logOut(): void {}

	return (
		<header className="flex items-center justify-between px-2 my-1 text-blue-100 bg-purple-400 shadow shadow-purple-300">
			<Image
				src={"/purplegirl.svg"}
				height={"30"}
				width={"30"}
				alt={"Lulu Story"}
				className="rounded-lg P-1 shadow-lg shadow-purple-200"
			></Image>
			<nav className="nav-bar flex gap-4 font-bold text-indigo-800 ">
				<Link href="/">Home</Link>
				<Link href="/edit">Edit</Link>
				{/* <Link href="/about">About</Link> */}
			</nav>
			<div className="flex gap-2 right-0 text-xs text-indigo-800">
				{isLogin && (
					<div className="flex gap-2" onClick={logOut}>
						Logout
					</div>
				)}

				{!isSignUp && (
					<Link href="/signup">
						<div className="flex gap-2">SignUp</div>
					</Link>
				)}

				{!isLogin && isSignUp && (
					<Link href="/login">
						<div className="flex gap-2">Login</div>
					</Link>
				)}

				<div className=" text-[8px] px-2">Version: 0.1.6</div>
			</div>
		</header>
	);
}
