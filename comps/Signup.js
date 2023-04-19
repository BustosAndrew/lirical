import { Input, Button, VStack } from "@chakra-ui/react"

import { useState, useContext } from "react"
import { AuthContext } from "@/firebase/AuthProvider"

export const Signup = ({ togglePage }) => {
	const [username, setUsername] = useState("")
	const [pw, setPw] = useState("")

	const { register } = useContext(AuthContext)

	const submitHandler = async () => {
		let success = await register(username, pw, "")

		if (!success) {
			console.log("Registration failed!")
		} else togglePage()
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
				autoComplete='new-password'
				placeholder='Password'
				type='password'
				color='brand.800'
				value={pw}
				onChange={(e) => setPw(e.target.value)}
			/>
			<Button
				variant='ghost'
				color='brand.800'
				_hover={{ bg: "brand.900", color: "black" }}
				onClick={submitHandler}
			>
				Sign Up
			</Button>
			<Button
				variant='ghost'
				color='brand.800'
				_hover={{ bg: "brand.900", color: "black" }}
				onClick={togglePage}
			>
				Login
			</Button>
		</VStack>
	)
}
