import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import axios from "axios"
import { useEffect, useRef, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
	const [file, setFile] = useState()
	const form = useRef()

	const submitHandler = async (event) => {
		event.preventDefault()

		const formData = new FormData()
		formData.append("file", file, file.name)
		console.log(file.type)

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
		console.log(event.target.files)
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
					<form
						encType='multipart/form-data'
						ref={form}
						onSubmit={submitHandler}
					>
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
