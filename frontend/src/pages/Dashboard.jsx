import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/transaction/summary");

      setSummary(res.data.summary);
      setTransactions(res.data.transactions);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Balance: {summary.balance}</h2>
      <h3>Income: {summary.totalIncome}</h3>
      <h3>Expense: {summary.totalExpense}</h3>

      <hr />

      <h2>Transactions</h2>

      {transactions.map((t) => (
        <div key={t._id}>
          <p>{t.title} - ₹{t.amount} ({t.type})</p>
        </div>
      ))}
    </div>
  );
}