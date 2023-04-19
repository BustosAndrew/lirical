import { Flex, Link, Divider, HStack } from "@chakra-ui/react"
import NextLink from "next/link"
import Head from "next/head"
import { Login } from "@/comps/Login"
import { Signup } from "@/comps/Signup"
import { Portal } from "@/comps/Portal"
import { AuthContext } from "@/firebase/AuthProvider"
import { useState, useContext, useEffect } from "react"

export default function Account() {
	const [loggingIn, setLoggingIn] = useState(true)
	const [signedIn, setSignedIn] = useState(false)
	const { profile, logout } = useContext(AuthContext)

	const togglePage = () => {
		setLoggingIn(!loggingIn)
	}

	const signedInHandler = () => {
		setSignedIn(!signedIn)
	}

	useEffect(() => {
		if (profile) setSignedIn(true)
	}, [profile])

	return (
		<>
			<Head>
				<title>Manage Your Account</title>
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
					{(signedIn && <Portal logout={logout} />) ||
						(!profile && loggingIn && (
							<Login
								togglePage={togglePage}
								signedInHandler={signedInHandler}
							/>
						)) ||
						(!profile && !loggingIn && <Signup togglePage={togglePage} />)}
				</Flex>
			</Flex>
		</>
	)
}
