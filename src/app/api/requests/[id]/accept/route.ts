import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest, { params }: { params: { id: string }}){
  const { offerId } = await req.json();
  const offer = await prisma.offer.findUnique({ where:{ id: offerId } });
  if(!offer || offer.requestId !== params.id) return NextResponse.json({ error:'Oferta inválida' },{ status:400 });
  await prisma.request.update({ where:{ id: params.id }, data:{ status:'ACCEPTED', acceptedOfferId: offerId } });
  return NextResponse.json({ ok:true });
}
