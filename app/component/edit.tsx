"use client";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { IChapter, IDBStory, IDBStoryList, IStory } from "../interface/iStory";
import { SaveStory } from "@/pages/api/db-utility/story-dao";
import { ObjectId } from "mongodb";

export default function Edit() {
	const [story, setStory] = useState({} as IDBStory);
	const [storyList, setStoryList] = useState([] as IDBStoryList[]);
	const [selectStory, setSelectStory] = useState(false);

	const newStory: IDBStory = {
		_id: null,
		title: "",
		author: "Zihan Lu",
		summary: "",
		createDate: new Date(),
		updateDate: new Date(),
		content: [] as IChapter[],
		editing: true,
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
				body: JSON.stringify(story),
			});
		} else {
			const response = await fetch("/api/update-story", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(story),
			});
		}
	}

	async function openStoryList() {
		const response = await fetch("/api/story-list", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
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
			story.content.push(newChapter);
		} else {
			story.content = [newChapter];
		}

		const newStory = { ...story };
		setStory(newStory);
	}

	return (
		<div>
			<div className="flex gap-2">
				<Button color="primary" onPress={createStory}>
					New
				</Button>
				<Button color="primary" onPress={openStoryList}>
					Open
				</Button>
			</div>
			{selectStory && (
				<div>
					{storyList.map((story) => (
						<div key={story._id?.toString()}>
							<a
								href={`/edit/${story._id}`}
								onClick={() => {
									openStory(story._id);
								}}
							>
								{story.title}
							</a>
							<div>{story.author} </div>
							<div>{story.createDate.toString()} </div>
							<div>{story.summary}</div>
						</div>
					))}
				</div>
			)}

			<div>
				<div className="w-full max-w-2xl">
					<div>
						<input
							value={story.title}
							onChange={(e) => setStory({ ...story, title: e.target.value })}
							placeholder="Title"
						></input>
						<input
							value={story.author}
							onChange={(e) => setStory({ ...story, author: e.target.value })}
							placeholder="Author"
						></input>
					</div>
					<textarea
						className="w-full"
						rows={10}
						value={story.summary}
						onChange={(e) => setStory({ ...story, summary: e.target.value })}
						placeholder="Summary"
					></textarea>
				</div>
				<Button
					color="primary"
					onPress={() => newChapter({ index: -1, sequence: 0 })}
				>
					New Chapter
				</Button>

				{story.content?.length > 0 &&
					story.content.map((item, index) => {
						return (
							<div className="w-full max-w-2xl">
								<div key={index}>
									<input
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
										className="w-full"
										rows={10}
										value={item.content}
										onChange={(e) => {
											const newContent = [...story.content];
											newContent[index].content = e.target.value;
											setStory({ ...story, content: newContent });
										}}
									></textarea>
									{/* <div>Update Date: {item.updateDate.toString()}</div> */}
								</div>
								<Button
									color="primary"
									onPress={() =>
										newChapter({ index: index, sequence: item.sequence })
									}
								>
									New Chapter
								</Button>
							</div>
						);
					})}
			</div>

			<div>
				<Button
					color="primary"
					onPress={() => {
						saveStory();
					}}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
