import { CustomCard } from "@/comps/CustomCard"
import { Flex, Link, HStack, Divider } from "@chakra-ui/react"
import NextLink from "next/link"
import Head from "next/head"

export default function Subscribe() {
	return (
		<>
			<Head>
				<title>Subscribe to Lirical</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</Head>
			<Flex h='100vh' justifyContent='center' alignItems='flex-start'>
				<Flex alignItems='center' flexDir='column' gap={20}>
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
					<CustomCard padding={0} />
				</Flex>
			</Flex>
		</>
	)
}
