import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Heading,
	Text,
} from "@chakra-ui/react"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext } from "react"

export const CustomCard = ({ padding }) => {
	const { profile } = useContext(AuthContext)

	const openCheckout = async () => {
		if (!profile) return window.alert("You must be logged in to subscribe.")

		const uid = profile.uid
		try {
			const res = await fetch("/api/stripe", {
				method: "POST",
				body: JSON.stringify({ text: "checkout", uid: uid }),
			})

			const data = await res.json()
			window.location.href = data.url
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Card
			mx={[5, 0]}
			gap={5}
			bg='brand.900'
			align='center'
			textAlign='center'
			py={padding}
		>
			<CardHeader w='95%' borderBottom={"1px solid black"}>
				<Heading size='md'>Gain Access to Audio Transcription!</Heading>
			</CardHeader>
			<CardBody w='95%' borderBottom={"1px solid black"}>
				<Text fontWeight='bold'>
					Upload audio files to be transcribed by Whisper.
				</Text>
				<Heading>$4.99/mo USD</Heading>
				<Text fontSize='sm'>Cancel anytime.</Text>
			</CardBody>
			<CardFooter>
				<Button onClick={openCheckout} shadow='md' bg='brand.800'>
					Subscribe
				</Button>
			</CardFooter>
		</Card>
	)
}
