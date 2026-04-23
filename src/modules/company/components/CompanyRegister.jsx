import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import SecurityQuestion from "../../auth/components/SecurityQuestion";
import "../styles/CompanyRegister.css";

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

function CompanyRegister() {
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    companyName: "",
    legalRepresentative: "",
    cellPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRequest: {
      username: "",
      password: "",
      securityQuestions: [
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
      ],
    },
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const isCellphoneValid = formData.cellPhone.length === 10;

  const navigate = useNavigate();
  const cleanDigits = (value) => value.replace(/\D/g, "");

  const formatWithDotsAndDash = (value) => {
    const digits = cleanDigits(value);
    if (!digits) return "";
    if (digits.length <= 9) return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (
      digits.slice(0, 9).replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
      "-" +
      digits.slice(9, 10)
    );
  };

  const handleSecurityChange = (index, field, value) => {
    const updated = [...formData.userRequest.securityQuestions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      userRequest: {
        ...prev.userRequest,
        securityQuestions: updated,
      },
    }));
  };

  const validateStep = () => {
    console.log(step);

    if (step === 1) {
      return (
        formData.documentType &&
        formData.documentNumber &&
        formData.companyName &&
        formData.legalRepresentative &&
        formData.cellPhone &&
        isCellphoneValid &&
        formData.email
      );
    }

    if (step === 2) {
      return formData.userRequest.securityQuestions.every(
        (q) => q.question && q.answer,
      );
    }

    if (step === 3) {
      return formData.password && formData.confirmPassword && passwordsMatch;
    }

    return false;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const formatCellPhone = (value) => {
    if (!value) return "";
    return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
  };

  const handleIdTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      idType: value,
      documentNumber: "",
    }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const canSubmit = passwordsMatch && isCellphoneValid;

  const handleCancel = () => {
    navigate("/Company/Login");
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Company/Login");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIdentificationChange = (e) => {
    const raw = e.target.value;
    const onlyNums = cleanDigits(raw);
    const maxDigits = formData.idType === "NIT" ? 9 : 10;

    if (onlyNums.length <= maxDigits) {
      setFormData((prev) => ({
        ...prev,
        documentNumber: onlyNums,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const payload = {
      ...formData,
      userRequest: {
        ...formData.userRequest,
        username: formData.email,
        password: formData.password,
      },
    };

    console.log(payload);

    try {
      const response = await apiService.post("api/company", payload);

      if (response.status === 200) {
        setModalMessage("¡Clinica registrada exitosamente!");
        setModalType("success");
      }

      if (response.status === 400) {
        setModalMessage("¡La clinica ya se encuentra registrada!");
        setModalType("error");
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
          {step === 1 && (
            <>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="custom-select"
              >
                <option value="" disabled>
                  Selecciona tipo de identificación
                </option>
                <option value="NT">NIT</option>
                <option value="RT">RUT</option>
              </select>

              <input
                type="text"
                name="documentNumber"
                placeholder="Numero de Identificación"
                value={formatWithDotsAndDash(formData.documentNumber)}
                onChange={handleIdentificationChange}
                required
              />

              <input
                type="text"
                name="companyName"
                placeholder="Razón Social"
                value={formData.companyName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="legalRepresentative"
                placeholder="Representante Legal"
                value={formData.legalRepresentative}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="cellPhone"
                placeholder="Telefono Celular"
                value={formatCellPhone(formData.cellPhone)}
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
                  style={{
                    color: "red",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  El teléfono celular debe tener exactamente 10 dígitos
                </div>
              )}

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="step-buttons">
                <button
                  type="button"
                  className="btn-back"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  Continuar
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <SecurityQuestion
              questions={formData.userRequest.securityQuestions}
              onChangeQuestion={handleSecurityChange}
              onBack={prevStep}
              onNext={nextStep}
            />
          )}

          {step === 3 && (
            <>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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
                  style={{
                    color: "red",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Las contraseñas no coinciden
                </div>
              )}
              <div className="step-buttons">
                <button type="button" className="btn-cancel" onClick={prevStep}>
                  Retroceder
                </button>
                <button type="submit" className="btn-submit">
                  Registrar
                </button>
              </div>
            </>
          )}

          <div className="register-links">
            <span
              onClick={() => navigate("/Company/Login")}
              style={{
                cursor: "pointer",
                color: "#007bff",
                textDecoration: "underline",
              }}
            >
              ¿Ya tienes cuenta?
            </span>
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

export default CompanyRegister;
