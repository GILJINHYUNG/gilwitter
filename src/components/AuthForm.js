import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../fbase";

const AuthForm = () => {
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
	return (
		<>
			<form onSubmit={onSubmit} className="container">
				<input
					onChange={onChange}
					name="email"
					type="text"
					placeholder="Email"
					value={email}
					required
					className="authInput"
				/>
				<input
					onChange={onChange}
					name="password"
					type="password"
					placeholder="Password"
					value={password}
					required
					className="authInput"
				/>
				<input
					type="submit"
					className="authInput authSubmit"
					value={newAccount ? "Create Account" : "Log in"}
				/>
				{error && <span className="authError">{error}</span>}
			</form>
			<span onClick={toggleAccount} className="authSwitch">
				{newAccount ? "Log in" : "Create Account"}
			</span>
		</>
	);
};
export default AuthForm;
