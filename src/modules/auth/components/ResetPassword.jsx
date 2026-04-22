import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../core/resources/GlobalResource";
import PasswordForm from "../../auth/components/PasswordForm";
import AlertNotification from "../../alertNotification/components/AlertNotification";

function ResetPassword() {
  const [dataQuestions, setDataQuestions] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const loginPath = pathname.toLowerCase().includes("company")
    ? "/Company/Login"
    : "/Person/Login";

  const handleCancel = () => {
    navigate(loginPath);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalType === "success") {
      navigate(loginPath);
    }
  };

  const loadQuestions = async (id) => {
    const response = await apiService.get(`api/user/${id}/SecurityQuestions`);
    if (response.status !== 200) {
      throw new Error("No fue posible cargar las preguntas de seguridad");
    }

    return response.data;
  };

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleEmailContinue = async () => {
    try {
      const response = await apiService.get(`api/user/${formData.username}`);

      if (response.data.length === 0) {
        setModalMessage("El usuario no existe.");
        setModalType("error");
        setModalOpen(true);
        return;
      }

      const item = response.data[0];
      setUserExists(true);
      setFormData((prev) => ({
        ...prev,
        userId: item.userId,
        ...(item.personId != null ? { personId: item.personId } : {}),
        ...(item.companyId != null ? { companyId: item.companyId } : {}),
      }));
      const questions = await loadQuestions(item.userId);
      setDataQuestions(shuffle(questions).slice(0, 3));
      setStep(2);
    } catch (error) {
      setModalMessage(error);
      setModalType("error");
      setModalOpen(true);
    }
  };

  const handleSecurityContinue = async () => {
    const isValid = dataQuestions.every((q) => {
      const userAnswer = (answers[q.securityQuestionId] || "")
        .trim()
        .toLowerCase();
      const correctAnswer = (q.answer || "").trim().toLowerCase();
      return userAnswer === correctAnswer;
    });

    if (!isValid) {
      setModalMessage("Las respuestas de seguridad son incorrectas.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    setStep(3);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiService.put("api/user", formData);

      if (response.status === 200) {
        setModalMessage("Contraseña actualizada exitosamente.");
        setModalType("success");
        setModalOpen(true);
      }
    } catch (error) {
      setModalMessage("No fue posible actualizar la contraseña.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="register-container">
        <form className="register-form" onSubmit={handlePasswordSubmit}>
          <h2>Reestablecer Contraseña</h2>

          {step === 1 && (
            <>
              <h3>Validar correo</h3>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
              />

              <div className="step-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-next"
                  onClick={handleEmailContinue}
                  disabled={!formData.username}
                >
                  Continuar
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Preguntas de seguridad</h3>

              {dataQuestions.map((item) => (
                <div
                  key={item.securityQuestionId}
                  style={{ marginBottom: "1rem" }}
                >
                  <label>{item.question}</label>
                  <input
                    type="text"
                    placeholder="Tu respuesta"
                    value={answers[item.securityQuestionId] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.securityQuestionId]: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              ))}

              <div className="step-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-next"
                  onClick={handleSecurityContinue}
                >
                  Continuar
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Asignar nueva contraseña</h3>

              <PasswordForm
                formData={formData}
                setFormData={setFormData}
                onMatchChange={setPasswordsMatch}
              />

              <div className="step-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={!passwordsMatch}
                >
                  Continuar
                </button>
              </div>
            </>
          )}
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

export default ResetPassword;
