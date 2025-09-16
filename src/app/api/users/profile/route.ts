import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { couple: true },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({
      email: user.email,
      name: user.name,
      partner_name: user.couple?.partner_name || '',
      wedding_date: user.couple?.weddingDate || '',
    }));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const data = await request.json();
    const { name, partner_name, wedding_date } = data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { couple: true },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    if (user.coupleId) {
      await prisma.couple.update({
        where: { id: user.coupleId },
        data: {
          partner_name: partner_name,
          weddingDate: new Date(wedding_date),
        },
      });
    }

    return new NextResponse(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}