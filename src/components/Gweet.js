import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";

const Gweet = ({ gweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newGweet, setNewGweet] = useState(gweetObj.text);
	const GweetTextRef = doc(dbService, "gweets", `${gweetObj.id}`);
	const onDeleteClick = async () => {
		const ok = window.confirm("Are you sure you want to delete this gweet?");
		console.log(ok);
		if (ok) {
			await deleteDoc(GweetTextRef);
		}
	};
	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		await updateDoc(GweetTextRef, {
			text: newGweet,
		});
		setEditing(false);
	};
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewGweet(value);
	};
	return (
		<div>
			{editing ? (
				<>
					<form onSubmit={onSubmit}>
						<input
							type="text"
							placeholder="Edit your gweet"
							value={newGweet}
							required
							onChange={onChange}
						/>
						<input type="submit" value="Update Gweet" />
					</form>
					<button onClick={toggleEditing}>Cancle</button>
				</>
			) : (
				<>
					<h4>{gweetObj.text}</h4>
					{isOwner && (
						<>
							<button onClick={onDeleteClick}>Delete Gweet</button>
							<button onClick={toggleEditing}>Edit Gweet</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Gweet;
