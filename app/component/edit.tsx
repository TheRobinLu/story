"use client";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { IChapter, IDBStory, IDBStoryList, IStory } from "../interface/iStory";
import { SaveStory } from "@/pages/api/db-utility/story-dao";
import { ObjectId } from "mongodb";
import { PurpleGradientButton } from "./button";

export default function Edit() {
	const [story, setStory] = useState({} as IDBStory);
	const [storyList, setStoryList] = useState([] as IDBStoryList[]);
	const [selectStory, setSelectStory] = useState(false);
	const [username, setUsername] = useState("");

	useEffect(() => {
		const sessionUser = sessionStorage.getItem("username");
		if (!sessionUser) {
			return;
		}
		setUsername(atob(sessionUser));
	}, []);

	const newStory: IDBStory = {
		_id: null,
		title: "",
		author: "Zihan Lu",
		summary: "",
		createDate: new Date(),
		updateDate: new Date(),
		content: [] as IChapter[],
		editing: true,
		username: username,
	};

	const createStory = () => {
		setStory(newStory);
	};

	async function saveStory() {
		if (story._id == null) {
			const response = await fetch("/api/save-story", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: null, story: story }),
			});
		} else {
			const response = await fetch("/api/save-story", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: story._id.toString(), story: story }),
			});
		}
	}

	async function openStoryList() {
		const response = await fetch("/api/story-list-byuser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: username }),
		});
		const data = await response.json();
		const storyList = data.storyList;
		setStoryList(storyList);
		setSelectStory(true);
	}

	async function openStory(_id: ObjectId | null) {
		const response = await fetch("/api/get-story", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ storyId: _id?.toString() }),
		});

		const data = await response.json();
		console.log(data);
		const story = data.story;
		setStory(story);
		setSelectStory(false);
	}

	function newChapter({
		index,
		sequence,
	}: {
		index: number;
		sequence: number;
	}) {
		let newSequence = 0;
		if (index === -1) {
			newSequence = 1000;
		} else if (story.content.length == index + 1) {
			newSequence = sequence + 1000;
		} else if (story.content.length < index + 1) {
			newSequence = Math.round(
				(story.content[index + 1].sequence + sequence) / 2
			);
		}

		const newChapter: IChapter = {
			sequence: newSequence,
			subTitle: "",
			content: "",
			updateDate: new Date(),
			editing: true,
		};

		if (story.content) {
			story.content.splice(index + 1, 0, newChapter);
		} else {
			story.content = [newChapter];
		}

		const newStory = { ...story };
		setStory(newStory);
	}

	return (
		<div className="text-gray-700">
			<div className="flex gap-2">
				<PurpleGradientButton
					onPress={() => {
						createStory();
					}}
				>
					New
				</PurpleGradientButton>
				<PurpleGradientButton
					onPress={() => {
						openStoryList();
					}}
				>
					Open
				</PurpleGradientButton>
			</div>
			{selectStory && (
				<div>
					{storyList.map((story) => (
						<div
							key={story._id?.toString()}
							className="flex gap-2 text-sky-700"
						>
							<div
								className="cursor-pointer"
								onClick={() => {
									openStory(story._id);
								}}
							>
								{story.title}
							</div>
							<div className="text-sm text-bottom p-1">{story.author} </div>
							<div className="text-xs text-bottom p-2">
								{story.updateDate?.toLocaleString().substring(0, 10)}
							</div>
							{/* <div>{story.summary}</div> */}
						</div>
					))}
				</div>
			)}

			<div>
				<div className="w-full max-w-2xl">
					<div>
						<input
							className="px-2 rounded mt-1 font-bold bg-purple-200"
							value={story.title}
							onChange={(e) => setStory({ ...story, title: e.target.value })}
							placeholder="Title"
						></input>
						<span className="rounded text-sm text-gray-900 px-2">
							{" "}
							Author:{" "}
						</span>
						<input
							className="px-2 rounded mt-1 bg-purple-200"
							value={story.author}
							onChange={(e) => setStory({ ...story, author: e.target.value })}
							placeholder="Author"
						></input>
					</div>
					<textarea
						className="w-full rounded mt-1 bg-purple-200"
						rows={3}
						value={story.summary}
						onChange={(e) => setStory({ ...story, summary: e.target.value })}
						placeholder="Summary"
					></textarea>
				</div>

				<PurpleGradientButton
					onPress={() => {
						newChapter({ index: -1, sequence: 0 });
					}}
				>
					New Chapter
				</PurpleGradientButton>

				{story.content?.length > 0 &&
					story.content.map((item, index) => {
						return (
							<div className="w-full max-w-2xl">
								<div key={index}>
									<input
										className="px-2 rounded p-1 mt-1 bg-purple-200"
										value={item.subTitle}
										onChange={(e) => {
											const newContent = [...story.content];
											newContent[index].subTitle = e.target.value;
											setStory({ ...story, content: newContent });
										}}
									></input>
								</div>
								<div>
									<textarea
										className="w-full rounded p-1 mt-1 bg-purple-200"
										rows={30}
										value={item.content}
										onChange={(e) => {
											const newContent = [...story.content];
											newContent[index].content = e.target.value;
											setStory({ ...story, content: newContent });
										}}
									></textarea>
									{/* <div>Update Date: {item.updateDate.toString()}</div> */}
								</div>
								<PurpleGradientButton
									onPress={() => {
										newChapter({ index: index, sequence: item.sequence });
									}}
								>
									New Chapter
								</PurpleGradientButton>
							</div>
						);
					})}
			</div>

			<div className="mt-1">
				<PurpleGradientButton
					onPress={() => {
						saveStory();
					}}
				>
					Save
				</PurpleGradientButton>
			</div>
		</div>
	);
}
