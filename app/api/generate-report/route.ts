import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subjectId, assessmentId, responses } = await request.json()

    if (!subjectId || !assessmentId || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `You are an expert HR consultant specializing in 360-degree feedback assessments. 
Generate a professional, constructive, and actionable 360° feedback report based on the following assessment responses.

Assessment ID: ${assessmentId}
Subject ID: ${subjectId}

Responses collected:
${JSON.stringify(responses, null, 2)}

Please provide:
1. An executive summary (2-3 sentences)
2. Key strengths identified (3-5 bullet points)
3. Areas for development (3-5 bullet points)  
4. Specific recommendations for growth (3-5 actionable items)
5. Overall assessment summary

Format the report professionally and ensure it is constructive, specific, and actionable. 
Target length: approximately 600-800 words.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR consultant specializing in 360-degree feedback assessments. Generate professional, constructive, and actionable feedback reports.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    })

    const reportContent = completion.choices[0]?.message?.content

    if (!reportContent) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      report: reportContent,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}