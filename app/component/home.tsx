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
			<h1 className="p-2 text-purple-950">Story List</h1>
			<ul>
				{storyList.map((story) => (
					<li
						key={story._id?.toString()}
						className="p-2 text-purple-950 gap-4 text-bottom"
					>
						<div className="flex gap-4 text-bottom align-bottom">
							<a href={`/story/${story._id}`} className="font-semibold   ">
								{story.title}
							</a>
							<div className="text-sm pt-1 text-bottom">{story.author} </div>
							<div className="text-xs pt-2 text-bottom">
								{story.createDate.toString().substring(0, 10)}{" "}
							</div>
						</div>
						<div className="text-xs p-1 text-bottom">{story.summary}</div>
					</li>
				))}
			</ul>
		</div>
	);
}
