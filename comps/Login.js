import { Input, Button, VStack } from "@chakra-ui/react"

import { useState, useContext } from "react"
import { AuthContext } from "@/firebase/AuthProvider"

export const Login = ({ togglePage, signedInHandler }) => {
	const [username, setUsername] = useState("")
	const [pw, setPw] = useState("")
	const { login } = useContext(AuthContext)

	const submitHandler = async () => {
		let success = await login(username, pw)

		if (!success) console.log("login failed")
		else signedInHandler()
	}

	return (
		<VStack w='xs'>
			<Input
				autoComplete='email'
				placeholder='Email'
				type='email'
				color='brand.800'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<Input
				autoComplete='current-password'
				placeholder='Password'
				type='password'
				color='brand.800'
				value={pw}
				onChange={(e) => setPw(e.target.value)}
			/>
			<Button
				color='brand.800'
				_hover={{ bg: "brand.900", color: "black" }}
				variant='ghost'
				onClick={submitHandler}
			>
				Login
			</Button>
			<Button
				color='brand.800'
				_hover={{ bg: "brand.900", color: "black" }}
				variant='ghost'
				onClick={togglePage}
			>
				Sign Up
			</Button>
		</VStack>
	)
}
