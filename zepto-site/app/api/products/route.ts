import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("smart-compare")

    const products = await db.collection("products").find({}).toArray()

    // Transform products to match the expected interface for demosites
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.prices?.zepto || 45,
      image: product.image,
      category: product.category
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
