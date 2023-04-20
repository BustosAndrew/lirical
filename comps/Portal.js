import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext, useState } from "react"

export const Portal = ({ logout }) => {
	const { profile } = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const openPortal = async () => {
		const customerId = profile?.customerId
		setLoading(true)
		try {
			const res = await fetch("/api/stripe", {
				method: "POST",
				body: JSON.stringify({ text: "portal", customerId: customerId }),
			})
			console.log(await res.json())
			const { url } = await res.json()
			window.location.href = url
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	return (
		<>
			<Heading color='brand.800'>Subscription Overview</Heading>
			<Text color='brand.800'>
				Subscription Status: {profile?.status || "N/A"}
			</Text>
			<Text color='brand.800'>
				Subscription Renews: {new Date(profile?.renews).toDateString() || "N/A"}
			</Text>
			<Text color='brand.800'>
				Subscription Ends: {new Date(profile?.end).toDateString() || "N/A"}
			</Text>
			<VStack>
				{profile?.customerId && (
					<Button isLoading={loading} bg='brand.800' onClick={openPortal}>
						Manage
					</Button>
				)}
				<Button bg='brand.800' onClick={logout}>
					Logout
				</Button>
			</VStack>
		</>
	)
}
