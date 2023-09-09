//import {useState, useEffect} from "react";

import { IDBStory } from "../../interface/iStory";

async function getStory(storyId: string): Promise<IDBStory> {
	console.log("getStory storyId", storyId);

	const response = await fetch(`${process.env.URL}/api/get-story`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ storyId }),
	});

	const data = await response.json();
	const story = data.story as IDBStory;
	console.log(data);

	return story;
}

export default async function StoryPage({ params }: any) {
	const storyId = params.storyId;
	let story = await getStory(storyId);
	// console.log(params, params.storyId);
	// console.log("storyId", storyId);

	return (
		<div>
			<h1>Story Page....</h1>
			<p>Story ID: {storyId}</p>

			{story && (
				<div>
					<div>{story?.title}</div>
					<div>{story?.author}</div>
					<div>{story?.summary}</div>
					{story?.content
						.sort((a, b) => a.sequence - b.sequence)
						.map((content, index) => (
							<div>
								<div key={index}>{content.subTitle}</div>
								<div key={index}>{content.content}</div>
								<div key={index}>{content.sequence}</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
