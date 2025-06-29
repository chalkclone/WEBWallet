export default async function handler(req, res) {
  const address = "osmo1psaaa8z5twqgs4ahgqdxwl86eydmlwhesmv4s9";

  const balancesURL = `https://osmosis-api.polkachu.com/osmosis/bank/v1beta1/balances/${address}`;
  const txsURL = `https://osmosis-api.polkachu.com/cosmos/tx/v1beta1/txs?events=transfer.recipient='${address}'`;

  try {
    const [balanceRes, txRes] = await Promise.all([
      fetch(balancesURL),
      fetch(txsURL),
    ]);

    const balances = await balanceRes.json();
    const txs = await txRes.json();

    res.status(200).json({
      balances: balances.balances || [],
      txs: txs.tx_responses || [],
    });
  } catch (error) {
    console.error("Ошибка при получении данных с Polkachu:", error);
    res.status(500).json({ error: "Не удалось получить данные с Polkachu" });
  }
}

