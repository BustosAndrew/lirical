import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Heading,
	Text,
	Link,
	VStack,
} from "@chakra-ui/react"
import NextLink from "next/link"

export const CustomCard = () => {
	const openPortal = async () => {
		const customerId = "cus_NiWek7T98xFomH"
		try {
			const res = await fetch("/api/stripe", {
				method: "POST",
				body: JSON.stringify({ text: "portal", customerId: customerId }),
			})

			const data = await res.json()
			window.location.href = data.url
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Card
			color='brand.800'
			borderColor='brand.900'
			bg='none'
			variant='outline'
			align='center'
			textAlign='center'
		>
			<CardHeader>
				<Heading size='md'>Gain Access to More Features!</Heading>
			</CardHeader>
			<CardBody>
				<Text>Upload audio files to be transcribed by Whisper.</Text>
			</CardBody>
			<CardFooter>
				<VStack>
					<Link
						as={NextLink}
						href='https://buy.stripe.com/test_8wM3dibzl26j3yo288'
					>
						<Button colorScheme='blue'>Subscribe</Button>
					</Link>
					<br />
					<Button onClick={openPortal} colorScheme='blue'>
						Portal
					</Button>
				</VStack>
			</CardFooter>
		</Card>
	)
}
