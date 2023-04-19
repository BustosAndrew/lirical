import { Button, Heading, Text } from "@chakra-ui/react"
import { AuthContext } from "@/firebase/AuthProvider"
import { useContext } from "react"

export const Portal = ({ logout }) => {
	const { profile } = useContext(AuthContext)

	const openPortal = async () => {
		const customerId = profile && profile.customerId
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
		<>
			<Heading color='brand.800'>Subscription Overview</Heading>
			<Text color='brand.800'>
				Subscription Status: {profile?.status || "N/A"}
			</Text>
			<Text color='brand.800'>
				Subscription Renews:{" "}
				{(profile?.renews && profile.renews.toLocaleDateString()) || "N/A"}
			</Text>
			<Text color='brand.800'>
				Subscription Ends:{" "}
				{(profile?.end && profile.end.toLocaleDateString()) || "N/A"}
			</Text>
			{profile?.customerId && (
				<Button bg='brand.800' onClick={openPortal}>
					Manage
				</Button>
			)}
			<Button bg='brand.800' onClick={logout}>
				Logout
			</Button>
		</>
	)
}
