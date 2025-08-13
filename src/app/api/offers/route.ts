import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const requestId = url.searchParams.get('requestId');
  const sellerId = url.searchParams.get('sellerId');
  
  let whereClause = {};
  
  if (requestId) {
    whereClause = { ...whereClause, requestId };
  }
  
  if (sellerId) {
    whereClause = { ...whereClause, sellerId };
  }
  
  if (Object.keys(whereClause).length === 0) {
    return NextResponse.json([]);
  }
  
  const list = await prisma.offer.findMany({ 
    where: whereClause, 
    orderBy: { price: 'asc' },
    include: {
      request: true
    }
  });
  
  return NextResponse.json(list);
}
export async function POST(req: NextRequest){
  const body = await req.json();
  if(!body?.requestId || !body?.price){
    return NextResponse.json({ error: 'Dados insuficientes' }, { status: 400 });
  }
  const seller = await prisma.user.upsert({ where:{ id:'seller1' }, update:{}, create:{ id:'seller1', name:'Loja Centro SP', role:'SELLER', city:'São Paulo', rating:4.8 } });
  const o = await prisma.offer.create({ data:{ requestId: String(body.requestId), sellerId: seller.id, price: Number(body.price), condition: String(body.condition||'seminovo'), message: String(body.message||''), etaDays: Number(body.etaDays||2) } });
  return NextResponse.json(o);
}
