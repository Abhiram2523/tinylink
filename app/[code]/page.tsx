import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params

  const link = await prisma.link.findUnique({
    where: { code },
  })

  if (!link) {
    notFound()
  }

  // Update click count and last clicked timestamp atomically
  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: {
        increment: 1,
      },
      lastClickedAt: new Date(),
    },
  })

  // Perform 302 redirect - redirect() throws a special error that Next.js catches
  redirect(link.targetUrl)
}

