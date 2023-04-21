const stripe = require("stripe")(process.env.SK)

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

	const parsedBody = JSON.parse(body)
	const { text } = parsedBody

	if (text === "portal") {
		try {
			const { customerId } = parsedBody
			const returnUrl = "https://app.lirical.xyz/account"

			const portalSession = await stripe.billingPortal.sessions.create({
				customer: customerId,
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
				success_url: "https://app.lirical.xyz/account",
				cancel_url: "https://app.lirical.xyz/account",
				metadata: { uid: uid },
			})

			res.status(307).send({ url: session.url })
		} catch (err) {
			res.status(500).send({ err: err })
		}
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
