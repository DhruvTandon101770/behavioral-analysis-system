import { NextResponse } from "next/server"

// Array of India-related news sentences that will be updated daily
// In a real application, this would be fetched from a news API
const indiaNewsSentences = [
  "India celebrates Republic Day with grand parade in Delhi",
  "Indian cricket team wins series against Australia",
  "Monsoon season begins across several states in India",
  "New Delhi implements measures to reduce air pollution",
  "Indian Space Research Organisation launches satellite successfully",
  "Taj Mahal remains India's most visited tourist attraction",
  "Mumbai's local trains resume normal service after disruption",
  "Indian government announces new education policy",
  "Farmers in Punjab report record wheat harvest this year",
  "Bollywood film industry celebrates centenary of Indian cinema",
  "Indian tech startups attract record foreign investment",
  "Diwali festival lights up cities across India",
  "India's COVID-19 vaccination drive reaches rural areas",
  "Heavy rainfall causes flooding in Kerala region",
  "Indian athletes win medals at international competition",
  "New highway connecting major cities opens in India",
  "Traditional handicrafts from India showcased at global exhibition",
  "Indian scientists develop new renewable energy technology",
  "Cultural festival celebrates diversity of Indian traditions",
  "India's stock market reaches all-time high",
]

// General news sentences for other regions
const generalNewsSentences = [
  "Global leaders gather for climate summit in Paris",
  "Scientists discover new species in Amazon rainforest",
  "Tech company launches revolutionary AI assistant",
  "Stock markets reach record highs amid economic recovery",
  "Olympic committee announces host city for 2032 games",
  "Researchers develop breakthrough cancer treatment",
  "Space agency plans mission to explore distant planet",
  "Major earthquake strikes coastal region causing damage",
  "Government unveils new infrastructure investment plan",
  "Famous artist's painting sells for millions at auction",
  "Renewable energy surpasses coal for electricity generation",
  "Archaeologists uncover ancient city in desert region",
  "Central bank adjusts interest rates to combat inflation",
  "Film director wins prestigious award at international festival",
  "Health officials report decline in virus cases nationwide",
  "Automotive company reveals electric vehicle prototype",
  "Tropical storm approaches southeastern coastal areas",
  "University researchers publish groundbreaking study",
  "Technology firm announces merger with industry competitor",
  "Sports team wins championship after dramatic final match",
]

// This would be updated daily in a real application
const lastUpdated = new Date().toISOString().split("T")[0] // Today's date

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const country = url.searchParams.get("country")

    // Select sentences based on country parameter
    const sentences = country?.toLowerCase() === "india" ? indiaNewsSentences : generalNewsSentences

    // Select a random sentence from the array
    const randomIndex = Math.floor(Math.random() * sentences.length)
    const sentence = sentences[randomIndex]

    return NextResponse.json({
      sentence,
      lastUpdated,
      source: country?.toLowerCase() === "india" ? "india-news" : "global-news",
    })
  } catch (error) {
    console.error("Error generating news sentence:", error)
    return NextResponse.json({ message: "Error generating sentence" }, { status: 500 })
  }
}
