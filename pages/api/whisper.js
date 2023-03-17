// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const dotenv = require("dotenv").config()
const axios = require("axios")
const fs = require("fs")
const FormData = require("form-data")
const formidable = require("formidable")

const key = process.env.OPEN_AI_KEY
const model = "whisper-1"

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}

	return new Promise((resolve, reject) => {
		let formObj = new formidable.IncomingForm()

		const formData = new FormData()
		formData.append("model", model)

		formObj.parse(req, function (error, fields, file) {
			let filepath = file.fileupload.filepath
			formData.append("file", fs.createReadStream(filepath))
			axios
				.post("https://api.openai.com/v1/audio/transcriptions", formData, {
					headers: {
						Authorization: `Bearer ${key}`,
						"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
					},
				})
				.then((res) => {
					return res.status(200).send({ res: res.data })
				})
				.catch((err) => {
					return res.status(500).send({ error: err })
				})
				.finally(() => res.status(204).end())
		})
	})
}
