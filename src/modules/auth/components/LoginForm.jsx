import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import apiService from "../../core/resources/GlobalResource";
import "../styles/LoginForm.css";
import logo from "../../../assets/icon.png";

const EyeOpen = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      stroke="#333"
      strokeWidth="2"
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
    />
    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" />
  </svg>
);

const EyeClosed = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      stroke="#333"
      strokeWidth="2"
      d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.76 21.76 0 0 1 5.06-5.94M1 1l22 22"
    />
    <path
      stroke="#333"
      strokeWidth="2"
      d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"
    />
  </svg>
);

export default function LoginForm() {
  const { pathname } = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [person, setPerson] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerPath = pathname.toLowerCase().includes("company")
    ? "/Company/Register"
    : "/Person/Register";

  const homePath = pathname.toLowerCase().includes("company")
    ? "/Company/Home"
    : "/Person/Home";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.get(`api/User/${formData.username}`);

      console.log(response.data[0].username);
      console.log(response.data[0].password);
      if (!response.data[0].username || !response.data[0].password) {
        console.log("primer condicional");
        setModalMessage("El usuario o la contraseña no son válidos.");
        setModalType("error");
      } else if (
        response.data[0].username === formData.username &&
        response.data[0].password === formData.password
      ) {
        console.log("segundo condicional");
        console.log(JSON.stringify(response.data[0].person));
        console.log(JSON.stringify(person));
        const currentUser = (() => {
          if (pathname.toLowerCase().includes("company")) {
            setPerson(response.data[0].company);
            return response.data[0].company.legalRepresentative;
          }

          if (pathname.toLowerCase().includes("person")) {
            setPerson(response.data[0].person);
            return (
              response.data[0].person.names.split(" ")[0] +
              " " +
              response.data[0].person.surnames.split(" ")[0]
            );
          }

          return "Usuario sin identificar";
        })();

        console.log(currentUser);
        setModalMessage(`¡Bienvenido ${currentUser}!`);
        setModalType("success");
        setModalOpen(true);
      } else {
        console.log("tercer condicional");
        setModalMessage("Credenciales inválidas");
        setModalType("error");
        setModalOpen(true);
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      localStorage.setItem("User", JSON.stringify(person));
      navigate(homePath);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-left">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-title">Iniciar Sesión</h2>
            <input
              name="username"
              placeholder="Correo"
              value={formData.username}
              onChange={handleChange}
              className="login-input"
              autoComplete="off"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              autoComplete="new-password"
            />
            <button type="submit" className="login-button">
              Entrar
            </button>
            <div className="login-links">
              <Link to="/RecuperarContraseña" className="login-link">
                ¿Olvidaste tu contraseña?
              </Link>
              <Link to={registerPath} className="login-link">
                Registrarse
              </Link>
            </div>
          </form>
        </div>
      </div>
      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </>
  );
}
