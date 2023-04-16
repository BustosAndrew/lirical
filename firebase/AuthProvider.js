import React, { createContext, useContext, useEffect, useState } from "react"

import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth"
import {
	doc,
	onSnapshot,
	setDoc,
	serverTimestamp,
	getDocs,
	collection,
} from "firebase/firestore"

import { FirebaseContext } from "./FirebaseProvider"

export const AuthContext = createContext({})

const PROFILE_COLLECTION = "users" // name of the FS collection of user profile docs

export const AuthProvider = (props) => {
	const children = props.children

	const [user, setUser] = useState(null)
	const [profile, setProfile] = useState(null)
	const [authLoading, setAuthLoading] = useState(true)
	const [authErrorMessage, setAuthErrorMessage] = useState()

	const { myAuth, myFS } = useContext(FirebaseContext)

	const registerUser = async (email, password, displayName = "") => {
		try {
			let accountExists = false

			const querySnapshot = await getDocs(collection(myFS, PROFILE_COLLECTION))
			querySnapshot.forEach((doc) => {
				if (doc.data().displayName === displayName) accountExists = true
			})

			if (accountExists) return false

			let userCredential = await createUserWithEmailAndPassword(
				myAuth,
				email,
				password
			)
			let user = userCredential.user

			let userDocRef = doc(myFS, "users", user.uid)
			let userDocData = {
				uid: user.uid,
				email: email,
				displayName: displayName,
				dateCreated: serverTimestamp(),
			}

			setDoc(userDocRef, userDocData)
			return true
		} catch (ex) {
			console.error(`registerFunction() failed with: ${ex.message}`)
			setAuthErrorMessage(ex.message)
			return false
		}
	}

	const loginUser = async (username, password) => {
		try {
			let email = ""
			const querySnapshot = await getDocs(collection(myFS, PROFILE_COLLECTION))
			querySnapshot.forEach((doc) => {
				if (doc.data().displayName === username) email = doc.data().email
			})

			if (!email) email = username

			let userCredential = await signInWithEmailAndPassword(
				myAuth,
				email,
				password
			)

			let user = userCredential.user
			if (!user.uid) {
				let msg = `No UID found after signIn!`
				console.error(msg)
			}
			if (user) {
				console.log(`Logged in as uid(${user.uid}) email(${user.email})`)
			}
			setUser(user)
			return true
		} catch (ex) {
			let msg = `Login failure for email(${username}: ${ex.message})`
			console.error(msg)
			setAuthErrorMessage(ex.message)
			return false
		}
	}

	const logoutUser = async () => {
		try {
			setUser(null) // shut down the listeners
			await signOut(myAuth)
			console.log("Signed Out")
			return true
		} catch (ex) {
			console.error(ex)
			setAuthErrorMessage(ex.message)
			return false
		}
	}

	// hook into Firebase Authentication
	useEffect(() => {
		if (myAuth) {
			let unsubscribe = onAuthStateChanged(myAuth, (user) => {
				// if user is null, then we force them to login
				console.log("onAuthStateChanged(): got user", user)
				if (user) {
					setUser(user)
				}

				setAuthLoading(false)
			})

			return unsubscribe
		}
	}, [myAuth])

	// listen to the user profile (FS User doc)
	useEffect(() => {
		let unsubscribe = null
		const listenToUserDoc = async (uid) => {
			try {
				let docRef = doc(myFS, PROFILE_COLLECTION, uid)
				unsubscribe = await onSnapshot(docRef, (docSnap) => {
					let profileData = docSnap.data()
					console.log("Got user profile:", profileData)
					if (!profileData) {
						setAuthErrorMessage(
							`No profile doc found in Firestore at: ${docRef.path}`
						)
					}
					setProfile(profileData)
				})
			} catch (ex) {
				console.error(`useEffect() failed with: ${ex.message}`)
				setAuthErrorMessage(ex.message)
			}
		}

		if (user?.uid) {
			listenToUserDoc(user.uid)

			return () => {
				unsubscribe && unsubscribe()
			}
		} else if (!user) {
			setAuthLoading(true)
			setProfile(null)
			setAuthErrorMessage(null)
		}
	}, [user, setProfile, myFS])

	// if (authLoading) {
	// 	return <h1>Loading</h1>;
	// }

	const values = {
		authErrorMessage,
		authLoading,
		profile,
		user,
		login: loginUser,
		logout: logoutUser,
		register: registerUser,
	}

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
