import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // No MVP, estamos simulando o usuário logado como buyer1
  // Em uma aplicação real, isso viria de um sistema de autenticação
  const userId = 'buyer1';
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}