import React, { useEffect, useState } from "react";

export default function TokenList({ balances, txs }) {
  const [prices, setPrices] = useState({});
  const [showTxs, setShowTxs] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=osmosis,cosmos,stargaze,usd-coin&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices({
          uosmo: data.osmosis?.usd || 0,
          ibc_atom: data.cosmos?.usd || 0,
          ibc_stars: data.stargaze?.usd || 0,
          ibc_usdc: data["usd-coin"]?.usd || 1,
        });
      } catch (e) {
        console.error("Ошибка загрузки цен CoinGecko:", e);
      }
    };

    fetchPrices();
  }, []);

  function formatToken(denom) {
    if (denom === "uosmo") return "OSMO";
    if (denom.includes("USDC")) return "USDC";
    if (denom.includes("ATOM")) return "ATOM";
    if (denom.includes("STARS")) return "STARS";
    return denom.slice(0, 6) + "...";
  }

  const displayBalances = balances.map((b) => {
    const denomKey = b.denom === "uosmo" ? "uosmo" : b.denom.includes("USDC")
      ? "ibc_usdc"
      : b.denom.includes("ATOM")
      ? "ibc_atom"
      : b.denom.includes("STARS")
      ? "ibc_stars"
      : null;

    const token = formatToken(b.denom);
    const price = denomKey ? prices[denomKey] || 0 : 0;
    const amount = parseFloat(b.amount) / 1e6;

    return {
      token,
      amount,
      price,
      value: amount * price,
    };
  });

  const total = displayBalances.reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="text-white p-4">
      <h2 className="text-xl font-bold mb-2">💰 Общий баланс: {total.toFixed(2)} USDC</h2>
      <div className="space-y-2">
        {displayBalances.map((b, i) => (
          <div key={i} className="bg-gray-800 p-2 rounded-xl shadow">
            <div className="flex justify-between">
              <span>{b.token}</span>
              <span>{b.amount.toFixed(2)} (${b.value.toFixed(2)})</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
        onClick={() => setShowTxs(!showTxs)}
      >
        {showTxs ? "Скрыть транзакции" : "Показать входящие транзакции"}
      </button>

      {showTxs && (
        <div className="mt-4 space-y-2">
          {txs.map((tx, i) => (
            <div key={i} className="bg-gray-900 p-2 rounded-xl text-sm">
              <div>📥 От: {tx.tx.body.messages[0].from_address}</div>
              <div>💸 Сумма: {tx.tx.body.messages[0].amount[0].amount / 1e6}</div>
              <div>🕒 {new Date(tx.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
