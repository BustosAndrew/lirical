import { Heading } from "@chakra-ui/react"
import { CustomMenu } from "../comps/CustomMenu"
import { Form } from "../comps/Form"
import { Output } from "../comps/Output"

export const steps = [
	{
		label: "Step 1",
		content: function (val) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Select Input Type
					</Heading>
					<CustomMenu changeInputType={val} />
				</>
			)
		},
	},
	{
		label: "Step 2",
		content: function (val, handler, toggler) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Input Your Lyrics
					</Heading>
					<Form input={val} outputHandler={handler} toggleSubmitted={toggler} />
				</>
			)
		},
	},
	{
		label: "Step 3",
		content: function (val) {
			return (
				<>
					<Heading size='lg' mb={5} textAlign='center' color='brand.800'>
						Suggested Lyrics
					</Heading>
					<Output output={val} />
				</>
			)
		},
	},
]
