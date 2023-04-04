import Head from "next/head"
import { useEffect, useState } from "react"
import { Button, Heading, Flex } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import { CustomMenu } from "../comps/CustomMenu"
import { Form } from "../comps/Form"
import { Output } from "../comps/Output"

const steps = [
	{
		label: "Step 1",
		content: function (val) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Select Input Type
					</Heading>
					<CustomMenu changeInputType={val} />
				</>
			)
		},
	},
	{
		label: "Step 2",
		content: function (val, handler, toggler) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Input Your Lyrics
					</Heading>
					<Form input={val} outputHandler={handler} toggleSubmitted={toggler} />
				</>
			)
		},
	},
	{
		label: "Step 3",
		content: function (val) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Suggested Lyrics
					</Heading>
					<Output output={val} />
				</>
			)
		},
	},
]

export default function Home() {
	const [input, setInput] = useState("")
	const [output, setOutput] = useState("")
	const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
		initialStep: 0,
	})
	const [submitted, setSubmitted] = useState(false)

	const changeInputType = (val) => {
		setInput(val)
	}

	const outputHandler = (output) => {
		setOutput(output)
	}

	const toggleSumbitted = () => {
		setSubmitted(!submitted)
	}

	const restart = () => {
		setSubmitted(!submitted)
	}

	return (
		<>
			<Head>
				<title>Lirical App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Flex h='100vh' justifyContent='center' alignItems='center'>
				<Flex
					justifyContent='center'
					alignItems='center'
					flexDir='column'
					textAlign='center'
					m='auto'
					pb={5}
				>
					<Steps w='sm' p={2} activeStep={activeStep}>
						{steps.map(({ label }, indx) => (
							<Step key={label}>
								{(indx === 0 && steps[0].content(changeInputType)) ||
									(indx === 1 &&
										steps[1].content(input, outputHandler, toggleSumbitted)) ||
									(indx === 2 && steps[2].content(output))}
							</Step>
						))}
					</Steps>
					{activeStep === steps.length ? (
						<Flex p={4}>
							<Button
								bg='brand.900'
								mx='auto'
								size='md'
								onClick={() => {
									reset()
									restart()
								}}
								_hover={{ background: "#f1ecaf" }}
							>
								Reset
							</Button>
						</Flex>
					) : (
						<Flex width='100%' justify='flex-end' pr={5}>
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
								_hover={{ background: "brand.800" }}
								isDisabled={!input || (activeStep === 1 && !submitted)}
							>
								{activeStep === steps.length - 1 ? "Finish" : "Next"}
							</Button>
						</Flex>
					)}
				</Flex>
			</Flex>
		</>
	)
}
