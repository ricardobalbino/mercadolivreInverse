
const base = 'http://localhost:3000';
async function expect(cond, msg){ if(!cond){ throw new Error('Teste falhou: '+msg); } }
async function main(){
  await fetch(base + '/api/seed', { method: 'POST' });
  const reqs = await fetch(base + '/api/requests').then(r=>r.json());
  console.log('Pedidos existentes:', Array.isArray(reqs) ? reqs.length : reqs);
  await expect(Array.isArray(reqs), 'GET /api/requests deve retornar array');

  const created = await fetch(base + '/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title:'iPhone 13 128GB', category:'Eletrônicos', description:'Cor preta, bom estado', maxPrice: 3000, radiusKm: 10, city: 'São Paulo' }) }).then(r=>r.json());
  console.log('Criado:', created?.id);
  await expect(!!created?.id, 'POST /api/requests deve criar e retornar id');

  const offer = await fetch(base + '/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: created.id, price: 2899, condition: 'seminovo', etaDays: 2, message: 'NF e garantia 90 dias' }) }).then(r=>r.json());
  console.log('Oferta criada:', offer?.id);
  await expect(!!offer?.id, 'POST /api/offers deve criar oferta');

  const offers = await fetch(base + '/api/offers?requestId='+created.id).then(r=>r.json());
  console.log('Ofertas:', offers.length);
  await expect(Array.isArray(offers), 'GET /api/offers deve retornar array');
  if(offers.length >= 2){ await expect(offers[0].price <= offers[1].price, 'Ofertas devem vir ordenadas por preço ASC'); }

  const badResp = await fetch(base + '/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: created.id }) });
  console.log('Oferta inválida status:', badResp.status);
  await expect(badResp.status === 400, 'POST /api/offers sem price deve retornar 400');

  const accepted = await fetch(base + `/api/requests/${created.id}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ offerId: offer.id }) }).then(r=>r.json());
  console.log('Aceite:', accepted);
  await expect(accepted?.ok === true, 'Aceite da oferta deve retornar ok:true');

  const delResp = await fetch(base + '/api/requests?id='+created.id, { method: 'DELETE' });
  await expect(delResp.status === 200, 'DELETE /api/requests deve retornar 200');

  const badAccept = await fetch(base + `/api/requests/${created.id}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ offerId: 'nao-existe' }) });
  await expect(badAccept.status === 400, 'POST /accept com offerId inválido deve 400');
}
main().catch(err=>{ console.error(err); process.exit(1); });
