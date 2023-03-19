import Head from "next/head"
import styles from "@/styles/Home.module.css"
import { useEffect, useRef, useState } from "react"
import {
	Button,
	Input,
	Heading,
	VStack,
	Flex,
	Center,
	background,
} from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"

const steps = [
	{ label: "Step 1", content: { text: "one" } },
	{ label: "Step 2", content: { text: "two" } },
	{ label: "Step 3", content: { text: "three" } },
]

export default function Home() {
	const [file, setFile] = useState()
	const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
		initialStep: 0,
	})

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
			<Flex justifyContent='center' alignContent='center' height='100vh'>
				<Center>
					<Flex flexDir='column' width='100%'>
						<Steps activeStep={activeStep}>
							{steps.map(({ label, content }) => (
								<Step key={label}>
									{/* {content.text} */}
									<form encType='multipart/form-data' onSubmit={submitHandler}>
										<VStack gap={2}>
											<Heading color='brand.800'>Upload Audio</Heading>
											<Input
												required
												type='file'
												name='file'
												accept='audio/*'
												size='md'
												color='brand.800'
												onChange={changeFile}
												borderColor='brand.800'
												className={styles.upload}
											/>
											<Button
												_hover={{ background: "#f1ecaf" }}
												type='submit'
												bgColor='brand.900'
											>
												Submit
											</Button>
										</VStack>
									</form>
								</Step>
							))}
						</Steps>
						{activeStep === steps.length ? (
							<Flex p={4}>
								<Button
									bg='brand.900'
									mx='auto'
									size='sm'
									onClick={reset}
									_hover={{ background: "#f1ecaf" }}
								>
									Reset
								</Button>
							</Flex>
						) : (
							<Flex width='100%' justify='flex-end'>
								<Button
									isDisabled={activeStep === 0}
									mr={4}
									onClick={prevStep}
									size='sm'
									variant='ghost'
									_disabled={{
										cursor: "not-allowed",
										opacity: 0.2,
									}}
									_hover={
										activeStep !== 0 && {
											background: "brand.900",
											color: "black",
										}
									}
									color='brand.800'
								>
									Prev
								</Button>
								<Button
									size='sm'
									bg='brand.900'
									onClick={nextStep}
									_hover={{ background: "#f1ecaf" }}
								>
									{activeStep === steps.length - 1 ? "Finish" : "Next"}
								</Button>
							</Flex>
						)}
					</Flex>
				</Center>
			</Flex>
		</>
	)
}
