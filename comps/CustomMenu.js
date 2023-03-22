import { Menu, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"

export const CustomMenu = ({ changeInputType }) => {
	const [menuVal, setMenuVal] = useState("Select Input Type")

	useEffect(() => changeInputType(""), [])

	return (
		<Menu>
			<MenuButton
				background='brand.900'
				as={Button}
				rightIcon={<ChevronDownIcon />}
				_hover={{ background: "brand.800" }}
				_active={{ background: "brand.800" }}
				mb={5}
				size='lg'
			>
				{(menuVal === "text" && "Text") ||
					(menuVal === "recording" && "New Recording") ||
					(menuVal === "file" && "File Upload") ||
					menuVal}
			</MenuButton>
			<MenuList>
				<MenuItem
					onClick={() => {
						setMenuVal("text")
						changeInputType("text")
					}}
				>
					Text
				</MenuItem>
				<MenuItem
					onClick={() => {
						setMenuVal("recording")
						changeInputType("recording")
					}}
				>
					New Recording
				</MenuItem>
				<MenuItem
					onClick={() => {
						setMenuVal("file")
						changeInputType("file")
					}}
				>
					File Upload
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
