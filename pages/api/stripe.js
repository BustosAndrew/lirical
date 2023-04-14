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

	const sig = req.headers["stripe-signature"]

	const body = await buffer(req)

	if (body.text !== undefined) {
		const { text } = body

		if (text === "portal") {
			const { customerId } = body

			// This is the url to which the customer will be redirected when they are done
			// managing their billing with the portal.
			const returnUrl = "https://app.lirical.xyz"

			const portalSession = await stripe.billingPortal.sessions.create({
				customer: customerId,
				return_url: returnUrl,
			})

			res.redirect(303, portalSession.url)
		}
	} else {
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
}
