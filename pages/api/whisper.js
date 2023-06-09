const dotenv = require("dotenv").config()
const fs = require("fs")
const FormData = require("form-data")
const formidable = require("formidable")
import fetch from "node-fetch"
// import { clearTimeout } from "timers"

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

	const form = new formidable.IncomingForm({
		keepExtensions: true,
	})

	form.parse(req, async (err, fields, files) => {
		if (err) return res.status(400).send({ error: "Parse error: " + err })
		const formData = new FormData()
		formData.append(
			"file",
			fs.createReadStream(files.file.filepath),
			files.file.originalFilename
		)
		formData.append("model", model)

		const id = setTimeout(
			() =>
				res.status(400).send({
					error:
						"Whisper is currently experience slowdowns. Please try again later.",
				}),
			9900
		)
		const response = await fetch(
			"https://api.openai.com/v1/audio/transcriptions",
			{
				method: "POST",
				headers: {
					...formData.getHeaders(),
					Authorization: `Bearer ${key}`,
				},
				body: formData,
			}
		)
		clearTimeout(id)
		const { text, error } = await response.json()
		if (response.ok) {
			res.status(200).send({ text: text })
		} else {
			console.log("OPEN AI ERROR:")
			console.log(error.message)
			res.status(400).send({ error: "OPEN AI ERROR: " + error.message })
		}
	})

	// res.status(200).json({ text: "end req" })
}
