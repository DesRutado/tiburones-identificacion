import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ['ES'],
    },
    success_url: `${appUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: appUrl,
  })

  return NextResponse.json({ url: session.url })
}
