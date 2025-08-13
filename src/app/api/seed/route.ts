import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(){
  const buyer = await prisma.user.upsert({ where:{ id:'buyer1' }, update:{}, create:{ id:'buyer1', name:'Ricardo (comprador)', role:'BUYER', city:'São Paulo', rating:4.7 } });
  const s1 = await prisma.user.upsert({ where:{ id:'seller1' }, update:{}, create:{ id:'seller1', name:'Loja Centro SP', role:'SELLER', city:'São Paulo', rating:4.8 } });
  const s2 = await prisma.user.upsert({ where:{ id:'seller2' }, update:{}, create:{ id:'seller2', name:'Tech Zona Sul', role:'SELLER', city:'São Paulo', rating:4.5 } });
  const req = await prisma.request.create({ data:{ title:'Notebook Gamer RTX 4060', category:'Eletrônicos', description:'16GB, 512GB+, aceito seminovo', maxPrice:5500, radiusKm:15, city:'São Paulo', buyerId: buyer.id } });
  await prisma.offer.create({ data:{ requestId:req.id, sellerId:s1.id, price:5299, condition:'seminovo', message:'Dell G15, 10 meses de uso', etaDays:1 } });
  await prisma.offer.create({ data:{ requestId:req.id, sellerId:s2.id, price:4990, condition:'usado', message:'Acer Nitro, NF e garantia 7 dias', etaDays:2 } });
  return NextResponse.json({ ok:true });
}
