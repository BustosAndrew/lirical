import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}
	try {
		const completion = await openai.createCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content:
						'Suggest lyrics specifically after "' + req.body.lyrics + '"',
				},
			],
			temperature: 0.8,
		})
		console.log(completion.data.choices[0].text)
		await res.status(200).send({ text: completion.data.choices[0].text })
	} catch (err) {
		res.status(400).send(err)
	}

	//res.status(200).json({ res: "end req" })
}
