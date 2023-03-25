import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Gweet = ({ gweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newGweet, setNewGweet] = useState(gweetObj.text);
	const GweetTextRef = doc(dbService, "gweets", `${gweetObj.id}`);
	const onDeleteClick = async () => {
		const ok = window.confirm("정말 이 그윗을 삭제하시겠습니까?");
		console.log(ok);
		if (ok) {
			try {
				await deleteDoc(GweetTextRef);
				if (gweetObj.attachmentUrl !== "") {
					await deleteObject(ref(storageService, gweetObj.attachmentUrl));
				}
			} catch (error) {
				window.alert("그윗을 삭제하는 데 실패했습니다!");
			}
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
		<div className="nweet">
			{editing ? (
				<>
					<form onSubmit={onSubmit} className="container nweetEdit">
						<input
							type="text"
							placeholder="Edit your Gweet"
							value={newGweet}
							required
							autoFocus
							onChange={onChange}
							className="formInput"
						/>
						<input type="submit" value="Update Gweet" className="formBtn" />
					</form>
					<span onClick={toggleEditing} className="formBtn cancelBtn">
						Cancel
					</span>
				</>
			) : (
				<>
					<h4>{gweetObj.text}</h4>
					{gweetObj.attachmentUrl && <img src={gweetObj.attachmentUrl} />}
					{isOwner && (
						<div className="nweet__actions">
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Gweet;
