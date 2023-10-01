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

		//const encodedUsername = sessionStorage.getItem("username");

		const sessionUser = sessionStorage.getItem("username");

		if (!sessionUser) {
			return;
		}
		//check if sessionUser is valid
		fetch("/api/check-user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				sessionUser: sessionUser,
				cookieUser: LuluStoryUser,
			}),
		}).then((res) => {
			if (res.status === 200) {
				setIsLogin(true);
			}
		});
	}, []);

	function logOut() {
		sessionStorage.removeItem("username");
		window.location.reload();
	}

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
				{isLogin && <Link href="/edit">Edit</Link>}
			</nav>
			<div className="flex gap-2 right-0 text-xs text-indigo-800">
				{isLogin && (
					<button className="flex gap-2" onClick={logOut}>
						Logout
					</button>
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

				<div className=" text-[8px] px-2">Version: 0.2.3</div>
			</div>
		</header>
	);
}
