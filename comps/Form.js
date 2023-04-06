import {
	Input,
	Button,
	VStack,
	Textarea,
	HStack,
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition"
import styles from "@/styles/Form.module.css"

export const Form = ({ input, outputHandler, toggleSubmitted }) => {
	const [file, setFile] = useState()
	const [recording, setRecording] = useState(false)
	const [lyrics, setLyrics] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [alert, setAlert] = useState(false)
	const [error, setError] = useState("")
	const { transcript, resetTranscript } = useSpeechRecognition()

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		return null
	}

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		setLyrics(
			"Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
		)
	}
	const toggleListen = () => {
		if (!recording) {
			SpeechRecognition.startListening({
				continuous: true,
				language: "en-US",
			})
			setRecording(!recording)
		} else {
			SpeechRecognition.stopListening()
			setRecording(!recording)
		}
	}

	const restart = () => {
		SpeechRecognition.stopListening()
		setRecording(false)
		resetTranscript()
		setLyrics("")
	}

	const changeFile = (event) => {
		setFile(event.target.files[0])
	}

	const changeType = (val) => {
		if (val === "file")
			return (
				<>
					<HStack>
						<Input
							required
							type='file'
							name='file'
							accept='audio/*'
							color='brand.800'
							onChange={changeFile}
							borderColor='brand.900'
							_hover={{ borderColor: "brand.800" }}
							className={styles.upload}
							fontSize='.9rem'
						/>
						<Button
							_hover={{ background: "brand.800" }}
							bgColor='brand.900'
							onClick={transcribe}
							isDisabled={!file}
						>
							Transcribe
						</Button>
					</HStack>
					<Textarea
						rows={8}
						color='brand.800'
						_hover={{ borderColor: "brand.800" }}
						placeholder='(25 MB limit. Supported files: mp3, mp4, mpeg, mpga, m4a, wav, and webm)'
						onChange={(e) => setLyrics(e.target.value)}
						value={lyrics}
					></Textarea>
				</>
			)
		else if (val === "text")
			return (
				<Textarea
					rows={8}
					color='brand.800'
					placeholder='Type your lyrics here.'
					_hover={{ borderColor: "brand.800" }}
					w={["17rem", "sm"]}
					onChange={(e) => setLyrics(e.target.value)}
					value={lyrics}
				></Textarea>
			)
		else if (val === "recording")
			return (
				<>
					<Textarea
						rows={8}
						color='brand.800'
						placeholder='This text area is editable'
						w={["17rem", "sm"]}
						value={lyrics || transcript}
						onChange={(e) => setLyrics(e.target.value)}
					></Textarea>
					<HStack>
						<Button onClick={toggleListen} bg='brand.800'>
							{!recording ? "Start" : "Stop"} Recording
						</Button>
						<Button onClick={restart} bg='brand.800'>
							Reset
						</Button>
					</HStack>
				</>
			)
	}

	const transcribe = async () => {
		if (input === "file") {
			const formData = new FormData()
			formData.append("file", file)

			try {
				const response = await fetch("/api/whisper", {
					method: "POST",
					body: formData,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
				})
				const { text, error } = await response.json()
				if (response.ok) {
					setLyrics(text)
				} else setLyrics(error)
			} catch (error) {
				setLyrics("Caught: " + error)
			}
		}
	}

	const submitHandler = async (event) => {
		event.preventDefault()
		setIsLoading(true)
		try {
			const response = await fetch("/api/lyrics", {
				method: "POST",
				body: JSON.stringify({ text: lyrics }),
			})
			const { text, error } = await response.json()
			if (response.ok) {
				outputHandler(text)
				toggleSubmitted()
				setAlert(true)
			} else {
				setAlert(true)
				setError(error)
			}
		} catch (error) {
			setAlert(true)
			setError(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form encType='multipart/form-data' onSubmit={submitHandler}>
			<VStack className={styles.form} mb={2}>
				{changeType(input)}
				<Button
					_hover={{ background: "brand.800" }}
					type='submit'
					bgColor='brand.900'
					isDisabled={lyrics === ""}
					isLoading={isLoading}
				>
					Submit
				</Button>
				{alert &&
					(error ? (
						<Alert status='error' variant='solid'>
							<AlertIcon />
							<AlertTitle>Error!</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : (
						<Alert status='success' variant='solid'>
							<AlertIcon />
							<AlertTitle>Success!</AlertTitle>
							<AlertDescription>
								Success! Click Next to see your suggested lyrics.
							</AlertDescription>
						</Alert>
					))}
			</VStack>
		</form>
	)
}
