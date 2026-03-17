import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { assessmentId, raters } = await request.json()

    if (!assessmentId || !raters || !Array.isArray(raters)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const results = await Promise.allSettled(
      raters.map(async (rater: { email: string; name: string; token: string }) => {
        const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://jobulary360.vercel.app'}/survey?token=${rater.token}`

        const { data, error } = await resend.emails.send({
          from: 'Team Jobulary <team@jobulary360.com>',
          to: rater.email,
          subject: 'You have been invited to complete a 360° assessment',
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #0d9488; margin-bottom: 8px;">360° Assessment Invitation</h1>
              <p style="color: #475569; margin-bottom: 24px;">
                Hello ${rater.name},
              </p>
              <p style="color: #1e293b; margin-bottom: 24px;">
                You have been invited to provide feedback as part of a 360-degree assessment. 
                Your responses are confidential and will help support professional development.
              </p>
              <a href="${surveyUrl}" 
                 style="display: inline-block; background: #0d9488; color: #fff; 
                        padding: 14px 28px; border-radius: 8px; text-decoration: none;
                        font-weight: 600; margin-bottom: 24px;">
                Complete Assessment
              </a>
              <p style="color: #475569; font-size: 14px;">
                This link is unique to you. Please do not share it with others.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px;">
                Powered by Jobulary 360 — Enterprise Assessment Platform
              </p>
            </div>
          `,
        })

        if (error) throw error
        return { email: rater.email, messageId: data?.id }
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: raters.length,
    })
  } catch (error) {
    console.error('Send invitations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}