import { Menu, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "@/firebase/AuthProvider"

export const CustomMenu = ({ changeInputType }) => {
	const [menuVal, setMenuVal] = useState("Select Input Type")
	const { profile } = useContext(AuthContext)

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
				size='md'
			>
				{(menuVal === "text" && "Text") ||
					(menuVal === "recording" && "Record") ||
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
					Record
				</MenuItem>
				{profile && profile.status === "active" && (
					<MenuItem
						onClick={() => {
							setMenuVal("file")
							changeInputType("file")
						}}
					>
						File Upload
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	)
}
