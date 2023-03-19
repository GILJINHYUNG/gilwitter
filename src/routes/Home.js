import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import {
	collection,
	addDoc,
	getDocs,
	onSnapshot,
	query,
	orderBy,
} from "firebase/firestore";
import Gweet from "../components/Gweet";

const Home = ({ userObj }) => {
	const [gweet, setGweet] = useState("");
	const [gweets, setGweets] = useState([]);
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
	useEffect(() => {
		// getGweets();
		const q = query(
			collection(dbService, "gweets"),
			orderBy("createdAt", "desc")
		);
		onSnapshot(q, (snapshot) => {
			const gweetArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setGweets(gweetArr);
		});
	}, []);
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			await addDoc(collection(dbService, "gweets"), {
				text: gweet,
				createdAt: Date.now(),
				creatorId: userObj.uid,
			});
			setGweet("");
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
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					value={gweet}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input type="submit" value="Gweet" />
			</form>
			<div>
				{gweets.map((gweet) => (
					<Gweet
						key={gweet.id}
						gweetObj={gweet}
						isOwner={gweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
