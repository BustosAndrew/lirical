import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}
	const { text } = JSON.parse(req.body)
	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: "Suggest lyrics specifically after " + text + "",
				},
			],
			temperature: 1,
			stream: false,
		})
		res.status(200).send({ text: completion.data.choices[0].message.content })
	} catch (err) {
		res.status(400).send({ error: err.message })
	}
}
