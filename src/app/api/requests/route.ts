import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(){
  const list = await prisma.request.findMany({ orderBy:{ createdAt:'desc' } });
  return NextResponse.json(list);
}
export async function POST(req: NextRequest){
  const body = await req.json();
  const buyer = await prisma.user.upsert({ where:{ id:'buyer1' }, update:{}, create:{ id:'buyer1', name:'Ricardo (comprador)', role:'BUYER', city: body.city || 'São Paulo', rating:4.7 } });
  const r = await prisma.request.create({ data:{ title: body.title, category: body.category, description: body.description, maxPrice: Number(body.maxPrice), radiusKm: Number(body.radiusKm||10), city: body.city||'São Paulo', buyerId: buyer.id } });
  return NextResponse.json(r);
}
export async function DELETE(req: NextRequest){
  const id = new URL(req.url).searchParams.get('id');
  if(!id) return NextResponse.json({error:'missing id'},{status:400});
  await prisma.offer.deleteMany({ where:{ requestId:id }});
  await prisma.request.delete({ where:{ id }});
  return NextResponse.json({ ok:true });
}
