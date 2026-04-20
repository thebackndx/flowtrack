import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

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
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editTxId, setEditTxId] = useState(null);
    const [error, setError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [editData, setEditData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "",
    });
    const [range, setRange] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        fetchData();
    }, [range, sortBy, order]);

    const fetchData = async () => {
        try {
            const res1 = await API.get("/transaction/summary", {
                params: {
                    range: range || undefined,
                    sortBy,
                    order,
                },
            });
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
            setError("");

            await API.post("/transaction", {
                amount,
                title,
                type,
                category,
            });

            if (!category) {
                setError("Please select a category");
                return;
            }
            setAmount("");
            setTitle("");
            setCategory("");

            fetchData();

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Server not responding");
            }
        };
    }

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
            setCategoryError("");

            await API.post("/category", {
                name: newCategory,
                type: categoryType,
            });

            setNewCategory("");
            fetchData();

        } catch (err) {
            if (err.response?.data?.message) {
                setCategoryError(err.response.data.message);
            } else {
                setCategoryError("Server not responding");
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await API.delete(`/category/${id}`);
            fetchData();
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleUpdateCategory = async (id) => {
        try {
            await API.patch(`/category/${id}`, {
                name: editName,
            });

            setEditId(null);
            setEditName("");
            fetchData();

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleUpdateTransaction = async (id) => {
        try {
            await API.patch(`/transaction/${id}`, editData);

            setEditTxId(null);
            fetchData();

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Navbar />

            <div className="p-6 max-w-3xl mx-auto space-y-6">

                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                <div className="flex items-center gap-4 mb-4 flex-wrap">

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Filter:</span>
                        <select
                            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="24h">24h</option>
                            <option value="7d">7d</option>
                            <option value="30d">30d</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sort:</span>

                        <select
                            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Date</option>
                            <option value="amount">Amount</option>
                        </select>

                        <select
                            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>

                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="bg-white shadow p-2 rounded text-center">
                        Balance <br /> ₹{summary?.balance}
                    </div>

                    <div className="bg-white shadow p-2 rounded text-center text-green-600">
                        Income <br /> ₹{summary?.totalIncome}
                    </div>

                    <div className="bg-white shadow p-2 rounded text-center text-red-500">
                        Expense <br /> ₹{summary?.totalExpense}
                    </div>
                </div>
                {/* Add Transaction */}
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="font-semibold mb-2">Add Transaction</h2>

                    <div className="flex items-center gap-2 flex-wrap">

                        <input
                            className="border rounded-md px-3 py-1.5 text-sm w-40"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            className="border rounded-md px-2 py-1.5 text-sm w-24"
                            type="text"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <select
                            className="border rounded-md px-2 py-1.5 text-sm"
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
                            className="border rounded-md px-2 py-1.5 text-sm"
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
                            className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600"
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                        {error && (

                            <p className="text-red-500 text-sm mt-2">
                                {error}
                            </p>
                        )}

                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="font-semibold mb-2">Transactions</h2>

                    {transactions?.map((t) => (
                        <div
                            key={t._id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            {editTxId === t._id ? (
                                <div className="flex items-center justify-between w-full">

                                    <input
                                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        value={editData.title}
                                        onChange={(e) =>
                                            setEditData({ ...editData, title: e.target.value })
                                        }
                                    />

                                    <input
                                        className="border rounded-md px-2 py-1 text-sm w-24 appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        type="number"
                                        value={editData.amount}
                                        onChange={(e) =>
                                            setEditData({ ...editData, amount: e.target.value })
                                        }
                                    />

                                    <select
                                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        value={editData.type}
                                        onChange={(e) =>
                                            setEditData({ ...editData, type: e.target.value })
                                        }
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>

                                    <select
                                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        value={editData.category}
                                        onChange={(e) =>
                                            setEditData({ ...editData, category: e.target.value })
                                        }
                                    >
                                        {categories
                                            ?.filter((c) => c.type === editData.type)
                                            .map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>

                                    <div className="flex items-center gap-2">

                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md"
                                            onClick={() => handleUpdateTransaction(t._id)}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="text-gray-500 hover:text-black text-sm"
                                            onClick={() => setEditTxId(null)}
                                        >
                                            ✕
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="font-medium">{t.title}</p>
                                        <p className="text-sm text-gray-500">
                                            ₹{t.amount} • {t.type} • {t.category?.name} • {formatDate(t.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <button
                                            className="mr-2 text-blue-500"
                                            onClick={() => {
                                                setEditTxId(t._id);
                                                setEditData({
                                                    title: t.title,
                                                    amount: t.amount,
                                                    type: t.type,
                                                    category: t.category._id,
                                                });
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="text-red-500"
                                            onClick={() => handleDelete(t._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                        
                {/* Categories */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Categories</h2>

                    <div className="flex items-center gap-2 flex-wrap">

                        <input
                            className="border rounded-md px-3 py-1.5 text-sm w-40"
                            placeholder="New category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />

                        <select
                            className="border rounded-md px-2 py-1.5 text-sm"
                            value={categoryType}
                            onChange={(e) => setCategoryType(e.target.value)}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>

                        <button
                            className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600"
                            onClick={handleAddCategory}
                        >
                            Add
                        </button>
                        {categoryError && (
                            <p className="text-red-500 text-sm mt-2">
                                {categoryError}
                            </p>
                        )}

                    </div>

                    <div className="mt-3">
                        {categories?.map((c) => (
                            <div
                                key={c._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                {editId === c._id ? (
                                    <div className="flex gap-2 items-center w-full">

                                        <input
                                            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />

                                        <div className="flex items-center gap-2">

                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition"
                                                onClick={() => handleUpdateCategory(c._id)}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="text-gray-500 hover:text-black text-sm"
                                                onClick={() => setEditId(null)}
                                            >
                                                ✕
                                            </button>

                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <p>{c.name}</p>
                                            <p className="text-sm text-gray-500">{c.type}</p>
                                        </div>

                                        <div>
                                            <button
                                                className="mr-2 text-blue-500"
                                                onClick={() => {
                                                    setEditId(c._id);
                                                    setEditName(c.name);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="text-red-500"
                                                onClick={() => handleDeleteCategory(c._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}