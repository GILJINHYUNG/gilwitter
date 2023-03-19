import React, { useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { auth } from "../fbase";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState("");
	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let data;
			if (newAccount) {
				data = await createUserWithEmailAndPassword(auth, email, password);
			} else {
				data = await signInWithEmailAndPassword(auth, email, password);
			}
			console.log(data);
		} catch (error) {
			setError(error.message);
		}
	};
	const toggleAccount = () => setNewAccount((prev) => !prev);
	const onSocialClick = async (event) => {
		const {
			target: { name },
		} = event;
		let provider;
		if (name === "google") {
			provider = new GoogleAuthProvider();
		} else if (name === "github") {
			provider = new GithubAuthProvider();
		}
		const data = await signInWithPopup(auth, provider);
		console.log(data);
	};
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					name="email"
					type="text"
					placeholder="Email"
					value={email}
					required
				/>
				<input
					onChange={onChange}
					name="password"
					type="password"
					placeholder="Password"
					value={password}
					required
				/>
				<input type="submit" value={newAccount ? "Create Account" : "Log in"} />
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Log in" : "Create Account"}
			</span>
			<div>
				<button name="google" onClick={onSocialClick}>
					Continue with Google
				</button>
				<button name="github" onClick={onSocialClick}>
					Continue with Github
				</button>
			</div>
		</div>
	);
};

export default Auth;
