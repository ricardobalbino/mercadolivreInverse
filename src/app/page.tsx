import Link from 'next/link';
export default function Home(){
  return (
    <div className="container row">
      <section className="center" style={{minHeight:'28vh'}}>
        <div className="row" style={{textAlign:'center'}}>
          <span className="kicker">MERCADO INVERSO</span>
          <h1 className="hero-title">Compradores pedem. Vendedores ofertam.</h1>
          <p className="hero-sub">Encontre exatamente o que você quer — com disputa de preço, entrega rápida e segurança.</p>
          <div className="center" style={{gap:12}}>
            <Link className="btn" href="/requests">Sou Comprador</Link>
            <Link className="btn alt" href="/seller">Sou Vendedor</Link>
          </div>
        </div>
      </section>
      <section className="grid3">
        <div className="card"><div className="hd"><b>Poste um pedido</b></div><div className="bd sm">Descreva o item, preço máximo e raio. O resto a gente chama os vendedores.</div></div>
        <div className="card"><div className="hd"><b>Receba ofertas</b></div><div className="bd sm">Compare preço, condição e prazo. Negocie por link seguro via WhatsApp.</div></div>
        <div className="card"><div className="hd"><b>Pague com proteção</b></div><div className="bd sm">Taxa só no sucesso (simulado no MVP). Reputação bilateral.</div></div>
      </section>
    </div>
  );
}
