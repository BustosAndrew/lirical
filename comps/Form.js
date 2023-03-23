import { Input, Button, VStack, Textarea, HStack } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition"
import styles from "@/styles/Form.module.css"

export const Form = ({ input }) => {
	const [file, setFile] = useState()
	const [recording, setRecording] = useState(false)
	const [lyrics, setLyrics] = useState("")
	const { transcript, resetTranscript } = useSpeechRecognition()

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		return null
	}

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		console.log(
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
			)
		else if (val === "text")
			return (
				<Textarea
					rows={8}
					color='brand.800'
					placeholder='Type your lyrics here.'
					w='sm'
					sx={{ "@media max-width: 700px": { maxW: "17rem" } }}
				></Textarea>
			)
		else if (val === "recording")
			return (
				<>
					<Textarea
						rows={8}
						color='brand.800'
						placeholder='This text area is editable...'
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

	const submitHandler = async (event) => {
		event.preventDefault()
		if (input === "file") {
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
	}

	return (
		<form encType='multipart/form-data' onSubmit={submitHandler}>
			<VStack className={styles.form} mb={2}>
				{changeType(input)}
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
}
