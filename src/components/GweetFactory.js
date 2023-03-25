import React, { useRef, useState } from "react";
import { storageService, dbService } from "../fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const GweetFactory = ({ userObj }) => {
	const [gweet, setGweet] = useState("");
	const [attachment, setAttachment] = useState("");
	const fileInput = useRef();

	// const getGweets = async () => {
	// 	const dbGweets = await getDocs(collection(dbService, "gweets"));
	// 	dbGweets.forEach((doc) => {
	// 		const gweetObj = {
	// 			...doc.data(),
	// 			id: doc.id,
	// 			creatorId: userObj.uid,
	// 		};
	// 		setGweets((prev) => [gweetObj, ...prev]);
	// 	});
	// };
	const onSubmit = async (event) => {
		event.preventDefault();
		if (gweet === "") {
			return;
		}
		let attachmentUrl = "";
		if (attachment !== "") {
			const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			const response = await uploadString(
				attachmentRef,
				attachment,
				"data_url"
			); // 포맷이 data_url
			attachmentUrl = await getDownloadURL(response.ref);
		}

		const gweetObj = {
			text: gweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		};
		try {
			await addDoc(collection(dbService, "gweets"), gweetObj);
			setGweet("");
			setAttachment("");
		} catch (error) {
			console.log(error);
		}
	};
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setGweet(value);
	};
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		{
			theFile && reader.readAsDataURL(theFile);
		} // "data_url"
		reader.onloadend = (finishedEvent) => {
			console.log(finishedEvent);
			const {
				currentTarget: { result },
			} = finishedEvent;

			setAttachment(result);
		};
	};
	const onClearAttachment = () => {
		setAttachment("");
		fileInput.current.value = null;
	};
	return (
		<form onSubmit={onSubmit} className="factoryForm">
			<div className="factoryInput__container">
				<input
					className="factoryInput__input"
					value={gweet}
					onChange={onChange}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input type="submit" value="&rarr;" className="factoryInput__arrow" />
			</div>
			<label htmlFor="attach-file" className="factoryInput__label">
				<span>Add photos</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>
			<input
				id="attach-file"
				type="file"
				accept="image/*"
				onChange={onFileChange}
				style={{
					opacity: 0,
				}}
			/>
			{attachment && (
				<div className="factoryForm__attachment">
					<img
						src={attachment}
						style={{
							backgroundImage: attachment,
						}}
					/>
					<div className="factoryForm__clear" onClick={onClearAttachment}>
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			)}
		</form>
	);
};
export default GweetFactory;
