const stripe = require("stripe")(process.env.SK)

const endpointSecret = process.env.SS

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" })
		return
	}

	const body = await buffer(req)

	if (body.text !== null) {
		const parsedBody = JSON.parse(body)
		const { text } = parsedBody

		if (text === "portal") {
			const { customerId } = parsedBody
			const returnUrl = "http://localhost:3000"

			const portalSession = await stripe.billingPortal.sessions.create({
				customer: customerId,
				configuration: process.env.PORTAL,
				return_url: returnUrl,
			})

			res.status(307).send({ url: portalSession.url })
		}
	} else {
		const sig = req.headers["stripe-signature"]
		const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

		switch (event.type) {
			case "customer.created":
				const customerCreated = event.data.object
				res.status(201).send({ object: customerCreated })
				break
			case "customer.subscription.created":
				const subscriptionCreated = event.data.object
				res.status(201).send({ object: subscriptionCreated })

				break
			case "customer.subscription.deleted":
				const subscriptionDeleted = event.data.object
				res.status(200).send({ object: subscriptionDeleted })
				break
			default:
				console.log(`Unhandled event type ${event.type}`)
		}

		// res.send()
	}
}

const buffer = (req) => {
	return new Promise((resolve, reject) => {
		const chunks = []

		req.on("data", (chunk) => {
			chunks.push(chunk)
		})

		req.on("end", () => {
			resolve(Buffer.concat(chunks))
		})

		req.on("error", reject)
	})
}
