import React, { useEffect, useState } from "react";
import TokenList from "../components/TokenList";

export default function Home() {
  const [data, setData] = useState({ balances: [], txs: [] });

  useEffect(() => {
    fetch("/api/osmosis")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">🧾 Osmosis Баланс и Транзакции</h1>
        <TokenList balances={data.balances} txs={data.txs} />
      </main>
    </div>
  );
}
