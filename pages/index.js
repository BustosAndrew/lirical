import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import axios from "axios"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
	const submitHandler = (event) => {
		event.preventDefault()

		const data = new FormData(event.target)
		data.set("fileupload", data.get("fileupload"))

		const config = {
			headers: { "content-type": "multipart/form-data" },
		}

		axios
			.post("/api/whisper", data, config)
			.then((res) => console.log(res))
			.catch((err) => console.log(err))
	}

	return (
		<>
			<Head>
				<title>Lirical App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={styles.main}>
				<div className={styles.description}>
					<p>
						Get started by editing&nbsp;
						<code className={styles.code}>pages/index.js</code>
					</p>
					<div>
						<a
							href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
							target='_blank'
							rel='noopener noreferrer'
						>
							By{" "}
							<Image
								src='/vercel.svg'
								alt='Vercel Logo'
								className={styles.vercelLogo}
								width={100}
								height={24}
								priority
							/>
						</a>
					</div>
				</div>

				<div className={styles.center}>
					<form onSubmit={submitHandler}>
						<label htmlFor='fileupload'>Upload Audio file</label>
						<input required type='file' name='fileupload' accept='audio/*' />
						<button type='submit'>Submit</button>
					</form>
				</div>
			</main>
		</>
	)
}
