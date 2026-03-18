import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  classifyIndustry,
  generateWorkflow,
  generateStory,
  getIndustry,
  getAllIndustries
} from '@/lib/industries'

export async function POST(request: NextRequest) {
  try {
    // Instantiate OpenAI client at request time to avoid build-time errors
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Get all available industries for the prompt
    const industries = getAllIndustries()
    const industryList = industries.map(i => i.name).join(', ')

    // Use GPT-4o Vision to analyze the product image
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this product image and provide detailed classification.

Available industries: ${industryList}

Provide:
1. Product name (be specific)
2. Industry category (choose the most appropriate from the list above)
3. Brand (if identifiable, otherwise "Unknown")
4. Detailed description (2-3 sentences about the product)
5. Key features (list 3-5 distinguishing features)
6. Confidence score (0-100, how confident you are in the classification)

Respond in JSON format:
{
  "name": "specific product name",
  "category": "industry category from the list",
  "brand": "brand name or Unknown",
  "description": "detailed product description",
  "features": ["feature 1", "feature 2", "feature 3"],
  "confidence": 95,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response — strip markdown code fences if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) 
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()
    const aiResult = JSON.parse(jsonStr)

    // Classify into our industry system
    const industryId = classifyIndustry(
      aiResult.keywords || [],
      aiResult.name,
      aiResult.description
    )

    const industry = getIndustry(industryId)

    // Generate industry-specific workflow
    const workflow = generateWorkflow(industryId)

    // Generate AI story
    const story = generateStory(
      industryId,
      aiResult.name,
      aiResult.brand,
      {
        strain: aiResult.features?.[0] || '',
        location: 'certified facilities',
        artist: aiResult.brand
      }
    )

    // Combine results
    const result = {
      ...aiResult,
      industryId,
      industry: industry?.name,
      industryIcon: industry?.icon,
      workflow,
      story,
      authenticityFeatures: industry?.authenticityFeatures || [],
      marketSize: industry?.marketSize
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify image' },
      { status: 500 }
    )
  }
}
