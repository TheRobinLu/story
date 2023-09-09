"use client";
import Image from "next/image";
import Header from "./component/header";
import Home from "./component/home";

export default function HomePage() {
	return (
		<main className="relative max-w-2xl mx-auto">
			<header className="sticky top-0 z-50 ">
				<Header />
			</header>
			<div className="relative">
				<Home></Home>
			</div>
		</main>
	);
}
