import Head from "next/head"
import styles from "@/styles/Home.module.css"
import { useEffect, useRef, useState } from "react"

export default function Home() {
	const [file, setFile] = useState()

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

	const changeFile = (event) => {
		setFile(event.target.files[0])
	}

	return (
		<>
			<Head>
				<title>Lirical App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={styles.main}>
				<div className={styles.center}>
					<form encType='multipart/form-data' onSubmit={submitHandler}>
						<label htmlFor='fileupload'>Upload Audio file</label>
						<input
							required
							type='file'
							name='file'
							accept='audio/*'
							onChange={changeFile}
						/>
						<button type='submit'>Submit</button>
					</form>
				</div>
			</main>
		</>
	)
}
