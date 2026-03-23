import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrarUsuario.css";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
 

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

function RegistrarUsuario() {
  const [formData, setFormData] = useState({
    identificationType: "",
    identification: "",
    names: "",
    surnames: "",
    cellPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRequest: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const isCellphoneValid = formData.cellPhone.length === 10;

  const navigate = useNavigate();

  const formatNumberWithDots = (value) => {
    if (!value) return "";
    value = value.replace(/^0+/, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const canSubmit = passwordsMatch && isCellphoneValid;

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/home");
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const updatedFormData = {
      ...formData,
      userRequest: {
        username: formData.email,
        password: formData.password,
      },
    };

    console.log("Registrando usuario:", updatedFormData);

    try {
      const response = await apiService.post("api/person", updatedFormData);

      if (!response) {
        // alert("¡Usuario registrado exitosamente!");
        setModalMessage("¡Usuario registrado exitosamente!");
        setModalType("success");
        navigate("/Person/Login");
      }
      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al momento de registrar el usuario");
    }
  };

  return (
    <>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>
          <select
            name="identificationType"
            value={formData.identificationType}
            onChange={handleChange}
            required
            className="custom-select"
          >
            <option value="" disabled>
              Selecciona tipo de identificación
            </option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PS">Pasaporte</option>
            <option value="PP">Permiso de Permanencia</option>
          </select>

          <input
            type="text"
            name="identification"
            placeholder="Numero de Identificación"
            value={formatNumberWithDots(formData.identification)}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setFormData({
                ...formData,
                identification: onlyNums,
              });
            }}
            required
          />

          <input
            type="text"
            name="names"
            placeholder="Nombres"
            value={formData.names}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="surnames"
            placeholder="Apellidos"
            value={formData.surnames}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cellPhone"
            placeholder="Telefono Celular"
            value={formData.cellPhone}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              if (onlyNums.length <= 10) {
                setFormData({
                  ...formData,
                  cellPhone: onlyNums,
                });
              }
            }}
            required
          />

          {formData.cellPhone && !isCellphoneValid && (
            <div
              style={{ color: "red", marginBottom: "1rem", fontWeight: "bold" }}
            >
              El teléfono celular debe tener exactamente 10 dígitos
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none",
              }}
              tabIndex={0}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? EyeOpen : EyeClosed}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none",
              }}
              tabIndex={0}
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? EyeOpen : EyeClosed}
            </span>
          </div>
          {!passwordsMatch && (
            <div
              style={{ color: "red", marginBottom: "1rem", fontWeight: "bold" }}
            >
              Las contraseñas no coinciden
            </div>
          )}
          <button type="submit" disabled={!canSubmit}>
            Registrarse
          </button>
          <div className="register-links">
            <a href="Person/Login">¿Ya tienes cuenta?</a>
          </div>
        </form>
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

export default RegistrarUsuario;
