import { Button, Heading, Text, HStack, Badge } from "@chakra-ui/react"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext, useEffect, useState } from "react"

export const Portal = ({ logout }) => {
	const { profile } = useContext(AuthContext)
	const [loading, setLoading] = useState(false)
	const [scheme, setScheme] = useState("red")

	useEffect(() => {
		if (profile?.status === "active") {
			setScheme("green")
		} else if (profile?.status === "expiring") {
			setScheme("yellow")
		}
	}, [profile?.status])

	const openPortal = async () => {
		const customerId = profile?.customerId
		setLoading(true)
		try {
			const res = await fetch("/api/stripe", {
				method: "POST",
				body: JSON.stringify({ text: "portal", customerId: customerId }),
			})
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
			<Text fontSize='xl' color='brand.800'>
				Subscription Status:{" "}
				{<Badge colorScheme={scheme}>{profile?.status}</Badge> || "N/A"}
			</Text>
			<HStack>
				{profile?.customerId && (
					<Button isLoading={loading} bg='brand.800' onClick={openPortal}>
						Manage
					</Button>
				)}
				<Button bg='brand.800' onClick={logout}>
					Logout
				</Button>
			</HStack>
		</>
	)
}
