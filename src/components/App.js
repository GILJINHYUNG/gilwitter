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
				// setUserObj({
				// 	displayName: user.displayName,
				// 	uid: user.uid,
				// 	updateProfile: (args) => user.updateProfile(args),
				// });
			} else {
				setIsLoggedIn(false);
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);
	const refreshUser = async () => {
		const user = auth.currentUser;
		// setUserObj({
		// 	displayName: user.displayName,
		// 	uid: user.uid,
		// 	updateProfile: (args) => user.updateProfile(args),
		// });
		setUserObj(Object.assign({}, user));
	};
	return (
		<>
			{init ? (
				<AppRouter
					refreshUser={refreshUser}
					isLoggedIn={isLoggedIn}
					userObj={userObj}
				/>
			) : (
				"Initializing..."
			)}
			{/* <footer>&copy; {new Date().getFullYear()} Gwitter</footer> */}
		</>
	);
}

export default App;
