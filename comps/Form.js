import { Input, Button, VStack } from "@chakra-ui/react"
import { useState } from "react"
import styles from "@/styles/Form.module.css"

export const Form = ({ input }) => {
	const [file, setFile] = useState()

	const changeFile = (event) => {
		setFile(event.target.files[0])
	}

	const submitHandler = async (event) => {
		event.preventDefault()

		const formData = new FormData()
		formData.append("file", file, file.name)

		try {
			const response = await fetch("/api/whisper", {
				method: "POST",
				body: formData,
			})
			const { text, error } = await response.json()
			if (response.ok) {
				console.log(text)
			} else console.log(error)
		} catch (error) {
			console.log("Error:", error)
		}
	}

	return (
		input === "file" && (
			<form encType='multipart/form-data' onSubmit={submitHandler}>
				<VStack className={styles.form} mb={2}>
					<Input
						required
						type='file'
						name='file'
						accept='audio/*'
						color='brand.800'
						onChange={changeFile}
						borderColor='brand.800'
						className={styles.upload}
						maxW={"17rem"}
					/>
					<Button
						_hover={{ background: "brand.800" }}
						type='submit'
						bgColor='brand.900'
					>
						Submit
					</Button>
				</VStack>
			</form>
		)
	)
}
