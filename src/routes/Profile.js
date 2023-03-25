import React, { useEffect, useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth, dbService } from "../fbase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const Profile = ({ refreshUser, userObj }) => {
	const navigate = useNavigate();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onLogOUtClick = () => {
		signOut(auth);
		navigate("/");
	};
	const getMyGweets = async () => {
		const q = query(
			collection(dbService, "gweets"),
			where("creatorId", "==", userObj.uid),
			orderBy("createdAt", "desc")
		);
		const gweets = await getDocs(q);
		gweets.forEach((doc) => {
			console.log(doc.data());
		});
	};
	useEffect(() => {
		getMyGweets();
	}, []);
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		if (userObj.displayName !== newDisplayName) {
		}
		await updateProfile(auth.currentUser, {
			displayName: newDisplayName,
		});
		refreshUser();
	};
	return (
		<div className="container">
			<form onSubmit={onSubmit} className="profileForm">
				<input
					type="text"
					placeholder="Display name"
					autoFocus
					onChange={onChange}
					value={newDisplayName}
					className="formInput"
				/>
				<input
					type="submit"
					value="Update Profile"
					className="formBtn"
					style={{
						marginTop: 10,
					}}
				/>
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOUtClick}>
				Log Out
			</span>
		</div>
	);
};

export default Profile;
