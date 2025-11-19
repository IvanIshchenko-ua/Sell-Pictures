import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosClient";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, login, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.token);
      navigate("/admin");
    } catch {
      setError("Невірний логін або пароль");
    }
  };

  if (isLoading) {
    return <p className="text-slate-600">Завантаження...</p>;
  }

  return (
    <section className="mt-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Вхід</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
        <div>
          <label className="block text-sm mb-1">Логін</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
          Увійти
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;
