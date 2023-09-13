"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
	return (
		<header className="flex items-center justify-between p-1 my-1 text-blue-100 bg-purple-400">
			<nav className="nav-bar flex gap-4 font-bold text-indigo-800 ">
				<Link href="/">Home</Link>
				<Link href="/edit">Edit</Link>
				{/* <Link href="/about">About</Link> */}
			</nav>
			<div className="flex gap-2 right-0 text-xs font-light text-indigo-800">
				Version: 0.1.3
			</div>
		</header>
	);
}
