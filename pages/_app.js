import "@/styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { StepsTheme as Steps } from "chakra-ui-steps"
import "regenerator-runtime/runtime"
import { FirebaseProvider } from "@/firebase/FirebaseProvider"
import { AuthProvider } from "@/firebase/AuthProvider"

const colors = {
	brand: {
		900: "#fac22c",
		800: "#f1ecaf",
	},
	gray: {
		200: "#fac22c",
	},
}

// const Select = {
// 	parts: ["field"],
// 	baseStyle: {
// 		field: {
// 			_placeholder: {
// 				color: "brand.800",
// 			},
// 		},
// 	},
// }

const CustomSteps = {
	...Steps,
	baseStyle: (props) => {
		return {
			...Steps.baseStyle(props),
			stepIconContainer: {
				//...Steps.baseStyle(props).stepIconContainer,
			},
		}
	},
}

const theme = extendTheme({
	colors,
	components: {
		Steps: CustomSteps,
	},
})

export default function App({ Component, pageProps }) {
	return (
		<FirebaseProvider>
			<AuthProvider>
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
				</ChakraProvider>
			</AuthProvider>
		</FirebaseProvider>
	)
}
