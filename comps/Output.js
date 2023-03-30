import { Textarea } from "@chakra-ui/react"

export const Output = ({ output }) => {
	return (
		<Textarea
			rows={12}
			color='brand.800'
			_hover={{ borderColor: "brand.800" }}
			value={output}
			w='sm'
			sx={{ "@media max-width: 700px": { maxW: "17rem" } }}
		></Textarea>
	)
}
