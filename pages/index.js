import Head from "next/head"
import { useState } from "react"
import { Button, Heading, Flex, Center } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import { CustomMenu } from "../comps/CustomMenu"
import { Form } from "@/comps/Form"

const steps = [
	{
		label: "Step 1",
		content: function (val) {
			return <CustomMenu changeInputType={val} />
		},
	},
	{
		label: "Step 2",
		content: function (val) {
			return <Form input={val} />
		},
	},
	{ label: "Step 3", content: { html: "three" } },
]

export default function Home() {
	const [input, setInput] = useState("")
	const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
		initialStep: 0,
	})

	const changeInputType = (val) => {
		console.log(val)
		setInput(val)
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
					<Steps w='sm' p={5} activeStep={activeStep}>
						{steps.map(({ label }, indx) => (
							<Step key={label}>
								<Heading textAlign='center' color='brand.800'>
									Upload Audio
								</Heading>
								{indx === 0
									? steps[0].content(changeInputType)
									: "text" || indx === 1
									? steps[1].content(input)
									: "text" || "text"}
							</Step>
						))}
					</Steps>
					{activeStep === steps.length ? (
						<Flex p={4}>
							<Button
								bg='brand.900'
								mx='auto'
								size='md'
								onClick={reset}
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
								isDisabled={!input}
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
