import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createLinkSchema, generateRandomCode } from '@/lib/validations'

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createLinkSchema.parse(body)

    // Generate code if not provided
    let code = validated.code
    if (!code) {
      // Generate random code and ensure uniqueness
      let attempts = 0
      do {
        code = generateRandomCode()
        const existing = await prisma.link.findUnique({
          where: { code },
        })
        if (!existing) break
        attempts++
        if (attempts > 10) {
          return NextResponse.json(
            { error: 'Failed to generate unique code' },
            { status: 500 }
          )
        }
      } while (true)
    } else {
      // Check if code already exists
      const existing = await prisma.link.findUnique({
        where: { code },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        )
      }
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        code,
        targetUrl: validated.targetUrl,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

