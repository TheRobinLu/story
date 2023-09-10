"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
	return (
		<header className="flex items-center justify-between p-2">
			<nav className="nav-bar flex gap-4">
				<Link href="/">Home</Link>
				<Link href="/edit">Edit</Link>
				<Link href="/about">About</Link>
			</nav>
			<div className="flex gap-2 right-0">ver: 0.0.4</div>
		</header>
	);
}
