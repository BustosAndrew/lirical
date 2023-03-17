// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const dotenv = require("dotenv").config()
const fs = require("fs")
const FormData = require("form-data")
import { withFileUpload } from "next-multiparty"

export const config = {
	api: {
		bodyParser: false,
	},
}

const key = process.env.OPEN_AI_KEY
const model = "whisper-1"

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}

	const file = req.file
	console.log(file)
	const formData = new FormData()
	formData.append("file", file)
	formData.append("model", model)

	const response = await fetch(
		"https://api.openai.com/v1/audio/transcriptions",
		{
			method: "POST",
			headers: {
				...formData.getHeaders(),
				Authorization: `Bearer ${process.env.key}`,
			},
			body: formData,
		}
	)

	const { text, error } = await response.json()
	if (response.ok) {
		res.status(200).json({ text: text })
	} else {
		console.log("OPEN AI ERROR:")
		console.log(error.message)
		res.status(400).send(new Error())
	}
}
