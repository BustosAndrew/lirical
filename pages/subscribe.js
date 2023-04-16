import { CustomCard } from "@/comps/CustomCard"
import { Flex } from "@chakra-ui/react"
import Head from "next/head"

export default function Subscribe() {
	return (
		<>
			<Head>
				<title>Subscribe to Lirical</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</Head>
			<Flex h='100vh' justifyContent='center' alignItems='center'>
				<CustomCard />
			</Flex>
		</>
	)
}
