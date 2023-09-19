// import { Configuration, OpenAIApi } from "openai"
import { OpenAIStream } from "../../helpers/OpenAIStream"

export const config = {
	runtime: "edge",
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}

	const { text } = await req.json()
	try {
		const payload = {
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: "Suggest lyrics specifically after " + text + "",
				},
			],
			temperature: 0.7,
			stream: true,
		}
		// clearTimeout(id)
		const stream = await OpenAIStream(payload)
		return new Response(stream)
		// res.status(200).send({ text: completion.data.choices[0].message.content })
	} catch (err) {
		res.status(400).send({ error: err })
	}
}
