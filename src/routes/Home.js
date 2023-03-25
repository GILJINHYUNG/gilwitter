import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import { onSnapshot, query, orderBy, collection } from "firebase/firestore";
import Gweet from "../components/Gweet";
import GweetFactory from "../components/GweetFactory";

const Home = ({ userObj }) => {
	const [gweets, setGweets] = useState([]);

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
	return (
		<div className="container">
			<GweetFactory userObj={userObj} />
			<div style={{ marginTop: 30 }}>
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
