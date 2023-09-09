import { useState, useEffect } from "react";
import { IDBStory, IDBStoryList } from "../interface/iStory";

export default function Home() {
	const [storyList, setStoryList] = useState([] as IDBStoryList[]);
	const [story, setStory] = useState({} as IDBStory);

	async function getStoryList() {
		const response = await fetch("/api/story-list", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		const storyList = data.storyList;
		setStoryList(storyList);
	}

	useEffect(() => {
		getStoryList();
	}, []);

	return (
		<div>
			<h1>Story List</h1>
			<ul>
				{storyList.map((story) => (
					<li key={story._id?.toString()}>
						<a href={`/story/${story._id}`}>{story.title}</a>
						<div>{story.author} </div>
						<div>{story.createDate.toString()} </div>
						<div>{story.summary}</div>
					</li>
				))}
			</ul>
		</div>
	);
}
