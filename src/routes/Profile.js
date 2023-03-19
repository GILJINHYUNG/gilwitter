import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../fbase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const navigate = useNavigate();
	const onLogOUtClick = () => {
		signOut(auth);
		navigate("/");
	};
	return (
		<>
			<button onClick={onLogOUtClick}>Log Out</button>
		</>
	);
};

export default Profile;
