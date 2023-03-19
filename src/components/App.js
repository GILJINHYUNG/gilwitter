import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AppRouter from "./Router";
import { auth } from "../fbase";

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user !== null) {
				setIsLoggedIn(true);
				setUserObj(user);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	return (
		<>
			{init ? (
				<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
			) : (
				"Initializing..."
			)}
			<footer>&copy; {new Date().getFullYear()} Gwitter</footer>
		</>
	);
}

export default App;
