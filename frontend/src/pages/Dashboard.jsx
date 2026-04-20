import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
    const [summary, setSummary] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("expense");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res1 = await API.get("/transaction/summary");
            const res2 = await API.get("/category");

            setSummary(res1.data.summary);
            setTransactions(res1.data.transactions);
            setCategories(res2.data.categories);

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleAdd = async () => {
        try {
            await API.post("/transaction", {
                amount,
                title,
                type,
                category,
            });

            setAmount("");
            setTitle("");
            setCategory("");

            fetchData();

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/transaction/${id}`);
            fetchData();
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleAddCategory = async () => {
        try {
            await API.post("/category", {
                name: newCategory,
                type: categoryType,
            });

            setNewCategory("");
            fetchData();

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
  <div className="p-6 max-w-3xl mx-auto">

    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

    <div className="bg-gray-100 p-4 rounded mb-4">
      <p>Balance: ₹{summary?.balance}</p>
      <p>Income: ₹{summary?.totalIncome}</p>
      <p>Expense: ₹{summary?.totalExpense}</p>
    </div>

    {/* Add Transaction */}
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-semibold mb-2">Add Transaction</h2>

      <input
        className="border p-2 mr-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 mr-2"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="border p-2 mr-2"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setCategory("");
        }}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <select
        className="border p-2 mr-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Category</option>
        {categories
          ?.filter((c) => c.type === type)
          .map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>

    {/* Transactions */}
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-semibold mb-2">Transactions</h2>

      {transactions?.map((t) => (
        <div
          key={t._id}
          className="flex justify-between border-b py-2"
        >
          <span>
            {t.title} - ₹{t.amount}
          </span>

          <button
            className="text-red-500"
            onClick={() => handleDelete(t._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>

    {/* Categories */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Categories</h2>

      <input
        className="border p-2 mr-2"
        placeholder="New category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />

      <select
        className="border p-2 mr-2"
        value={categoryType}
        onChange={(e) => setCategoryType(e.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button
        className="bg-green-500 text-white px-3 py-2 rounded"
        onClick={handleAddCategory}
      >
        Add
      </button>

      <div className="mt-3">
        {categories?.map((c) => (
          <p key={c._id}>{c.name}</p>
        ))}
      </div>
    </div>

  </div>
);
}