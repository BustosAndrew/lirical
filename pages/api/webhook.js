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

	const sig = req.headers["stripe-signature"]
	const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
	let status = ""
	let customer = ""
	let metadata = {}

	switch (event.type) {
		case "customer.subscription.created":
			const subscriptionCreated = event.data.object
			customer = subscriptionCreated.customer
			status = subscriptionCreated.status
			metadata = subscriptionCreated.metadata

			db.collection("users")
				.doc(metadata.uid)
				.update({ status: status, customerId: customer })

			res.status(201).send()
			break
		case "customer.subscription.deleted":
			const subscriptionDeleted = event.data.object
			metadata = subscriptionDeleted.metadata

			db.collection("users").doc(metadata.uid).update({ status: "inactive" })

			res.status(200).send()
			break
		case "customer.subscription.updated":
			const subscriptionUpdated = event.data.object
			status = subscriptionUpdated.status === "canceled" ? "expiring" : "active"
			metadata = subscriptionDeleted.metadata

			db.collection("users").doc(metadata.uid).update({ status: status })

			res.status(200).send()
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
