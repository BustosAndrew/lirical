const stripe = require("stripe")(process.env.SK)
const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")

const serviceAccount = JSON.parse(process.env.ADMIN || {})

if (admin.apps.length === 0)
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	})

const db = getFirestore()

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

	if (JSON.parse(body).text) {
		const parsedBody = JSON.parse(body)
		const { text } = parsedBody

		if (text === "portal") {
			try {
				const { customerId } = parsedBody
				const returnUrl = "https://app.lirical.xyz/account"

				const portalSession = await stripe.billingPortal.sessions.create({
					customer: customerId,
					configuration: process.env.PORTAL,
					return_url: returnUrl,
				})
				console.log(portalSession.url)
				res.status(307).send({ url: portalSession.url })
			} catch (err) {
				res.status(500).send({ err: err })
			}
		} else if (text === "checkout") {
			try {
				const { uid } = parsedBody

				const price = await stripe.prices.retrieve(process.env.PRICE)
				const session = await stripe.checkout.sessions.create({
					billing_address_collection: "auto",
					line_items: [
						{
							price: price.id,
							// For metered billing, do not pass quantity
							quantity: 1,
						},
					],
					mode: "subscription",
					success_url: `https://app.lirical.xyz/account`,
					cancel_url: `https://app.lirical.xyz/account`,
					metadata: { uid: uid },
				})

				res.status(307).send({ url: session.url })
			} catch (err) {
				res.status(500).send({ err: err })
			}
		}
	} else {
		const sig = req.headers["stripe-signature"]
		const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
		let status = ""
		let customer = ""
		let renews = null
		let end = null
		let metadata = {}

		switch (event.type) {
			case "customer.subscription.created":
				const subscriptionCreated = event.data.object
				customer = subscriptionCreated.customer
				status = subscriptionCreated.status
				renews = subscriptionCreated.current_period_end
				metadata = subscriptionCreated.metadata

				db.collection("users")
					.doc(metadata.uid)
					.update({ status: status, renews: renews, customerId: customer })

				res.status(201).send()
				break
			case "customer.subscription.deleted":
				const subscriptionDeleted = event.data.object
				metadata = subscriptionDeleted.metadata

				db.collection("users")
					.doc(metadata.uid)
					.update({ status: "inactive", renews: null, end: null })

				res.status(200).send()
				break
			case "customer.subscription.updated":
				const subscriptionUpdated = event.data.object
				status =
					subscriptionUpdated.status === "canceled" ? "inactive" : "active"
				metadata = subscriptionDeleted.metadata

				if (status === "active") renews = subscriptionUpdated.current_period_end
				else end = subscriptionUpdated.current_period_end

				db.collection("users")
					.doc(metadata.uid)
					.update({ status: status, renews: renews, end: end })

				res.status(200).send()
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
