import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Heading,
	Text,
	VStack,
} from "@chakra-ui/react"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext, useState } from "react"

export const CustomCard = ({ padding }) => {
	const { profile } = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const openCheckout = async () => {
		if (!profile) return window.alert("You must be logged in to subscribe.")
		setLoading(true)
		const uid = profile.uid
		try {
			const res = await fetch("/api/stripe", {
				method: "POST",
				body: JSON.stringify({ text: "checkout", uid: uid }),
			})
			const { url, err } = await res.json()
			if (res.status === 307) window.location.href = url
			else console.log(err)
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	return (
		<Card
			gap={5}
			bg='brand.900'
			align='center'
			textAlign='center'
			py={padding}
			w={["xs", "sm"]}
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
				<VStack>
					{profile?.status === "active" || profile?.status === "expiring" ? (
						<>
							<Text>You are subscribed.</Text>
							<Text>Go to Account to manage your subscription.</Text>
						</>
					) : (
						<Button
							isLoading={loading}
							onClick={openCheckout}
							shadow='md'
							bg='brand.800'
						>
							Subscribe
						</Button>
					)}
				</VStack>
			</CardFooter>
		</Card>
	)
}
