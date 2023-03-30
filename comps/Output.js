import { Textarea } from "@chakra-ui/react"
import { useState } from "react"

export const Output = ({ output }) => {
	const [result, setResult] = useState(output)
	return (
		<Textarea
			rows={12}
			color='brand.800'
			_hover={{ borderColor: "brand.800" }}
			value={result}
			onChange={(e) => setResult(e.target.value)}
			w={["17rem", "sm"]}
			sx={{ "@media max-width: 700px": { maxW: "17rem" } }}
			mb={2}
		></Textarea>
	)
}
