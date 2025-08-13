import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: body.name,
        city: body.city,
        role: body.role,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao atualizar usuário' }, { status: 500 });
  }
}