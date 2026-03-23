import { useEffect, useState } from "react";
import apiService from "./services/apiService";

function Login() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await apiService.get("/usuarios", token);
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Usuarios</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>{u.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Login;

