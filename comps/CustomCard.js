import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Heading,
	Text,
	VStack,
	useToast,
	Box,
	HStack,
} from "@chakra-ui/react"
import { WarningIcon } from "@chakra-ui/icons"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext, useState } from "react"

export const CustomCard = ({ padding }) => {
	const { profile } = useContext(AuthContext)
	const [loading, setLoading] = useState(false)
	const toast = useToast()

	const openCheckout = async () => {
		if (!profile)
			return toast({
				render: () => (
					<Box color='black' px={5} py={3} bg='brand.800' borderRadius={5}>
						<HStack alignItems='flex-start'>
							<WarningIcon boxSize={5} />
							<VStack alignItems='flex-start' gap={0}>
								<Text lineHeight={1} fontWeight='bold'>
									Cannot subscribe.
								</Text>
								<Text lineHeight={1}>You must be logged in to subscribe.</Text>
							</VStack>
						</HStack>
					</Box>
				),
				duration: 3000,
			})
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
