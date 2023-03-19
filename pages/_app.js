import "@/styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { StepsTheme as Steps } from "chakra-ui-steps"

const colors = {
	brand: {
		900: "#fac22c",
		800: "#f1ecaf",
	},
	gray: {
		200: "#fac22c",
	},
}

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
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}
