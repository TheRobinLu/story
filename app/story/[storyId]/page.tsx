//import {useState, useEffect} from "react";

import Header from "@/app/component/header";
import { IDBStory } from "../../interface/iStory";

async function getStory(storyId: string): Promise<IDBStory> {
	console.log({ storyId });
	const response = await fetch(`${process.env.URL}/api/get-story`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ storyId }),
		cache: "no-store",
	});

	const data = await response.json();
	const story = data.story as IDBStory;

	return story;
}

export default async function StoryPage({ params }: any) {
	const storyId = params.storyId;
	let story = await getStory(storyId);
	// console.log(params, params.storyId);
	// console.log("storyId", storyId);

	return (
		<div className="relative max-w-2xl mx-auto">
			<header className="sticky top-0 z-50 ">
				<Header />
			</header>
			{story && (
				<div className="text-center text-purple-950">
					<div className="text-lg font-bold ">{story?.title}</div>
					<div className="font-semibold text-xs">Author: {story?.author}</div>
					<div className="pt-3 font-semibold text-sm">Summary</div>
					<div className="p-2 text-xs text-left"> {story?.summary}</div>
					{story?.content.map((content, index) => (
						<div>
							<div className="pt-2" key={index}>
								{content.subTitle}
							</div>
							<pre
								key={index}
								className="p-2 text-left border-small rounded-lg"
							>
								<div className="whitespace-pre-wrap">{content.content}</div>
							</pre>
							{/* <div key={index}>{content.sequence}</div> */}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
