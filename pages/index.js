import Head from "next/head"
import { useState } from "react"
import {
	Button,
	Heading,
	Flex,
	Text,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Box,
	Link,
	HStack,
	Divider,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import { steps } from "@/data/steps"

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
		setSubmitted(true)
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
			<Flex h='100vh' justifyContent='center' alignItems='flex-start'>
				<Flex alignItems='center' flexDir='column' textAlign='center' pb={5}>
					<HStack alignContent='center' mt={10}>
						<Link fontSize={20} as={NextLink} color='brand.900' href='/'>
							Home
						</Link>
						<Divider orientation='vertical' borderColor='brand.900' h={8} />
						<Link
							fontSize={20}
							as={NextLink}
							color='brand.900'
							href='/subscribe'
						>
							Subscribe
						</Link>
						<Divider orientation='vertical' borderColor='brand.900' h={8} />
						<Link fontSize={20} as={NextLink} color='brand.900' href='/account'>
							Account
						</Link>
					</HStack>
					<Steps mt={[0, 0, 20]} w='sm' p={5} activeStep={activeStep}>
						{steps.map(({ label }, indx) => (
							<Step key={indx}>
								{(indx === 0 && steps[0].content(changeInputType)) ||
									(indx === 1 &&
										steps[1].content(input, outputHandler, toggleSumbitted)) ||
									(indx === 2 && steps[2].content(output))}
							</Step>
						))}
					</Steps>
					{activeStep === steps.length ? (
						<Flex direction='column' gap={5} p={4}>
							<Text fontWeight='bold' color='brand.800'>
								Would you like to start all over?
							</Text>
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
					<Heading
						mt={5}
						w={["80%", "sm"]}
						justifySelf='left'
						color='brand.900'
						size='lg'
					>
						Disclaimer
					</Heading>
					<Accordion textAlign='left' w={["80%", "xs"]} color='brand.800'>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										Why is it saying my lyrics are inappropriate or offensive?
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								Besides the reason it gives you, it&apos;s because Open AI has
								policies that prevent discrimination, harassment, and hate
								speech. You may have to try again with different lyrics.
							</AccordionPanel>
						</AccordionItem>

						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as='span' flex='1' textAlign='left'>
										How do I restart from the beginning?
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								Go to step 3, hit Finish and then hit Reset.
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Flex>
			</Flex>
		</>
	)
}
