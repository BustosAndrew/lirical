const stripe = require("stripe")(process.env.SK)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
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

	const sig = req.headers["stripe-signature"]

	const body = await buffer(req)
	const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

	// Handle the event
	switch (event.type) {
		case "customer.subscription.created":
			const subscriptionCreated = event.data.object
			// Then define and call a function to handle the event payment_intent.succeeded
			console.log("Subscription created")
			break
		case "customer.subscription.deleted":
			const subscriptionDeleted = event.data.object
			// Then define and call a function to handle the event payment_intent.succeeded
			console.log("Subscription deleted")
			break
		default:
			console.log(`Unhandled event type ${event.type}`)
	}

	// Return a 200 response to acknowledge receipt of the event
	res.send()
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
