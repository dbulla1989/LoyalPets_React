import { useState, useEffect } from "react";
import "../styles/PasswordForm.css";

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

function PasswordForm({ formData, setFormData, onMatchChange }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch = formData.password === formData.confirmPassword;

  useEffect(() => {
    onMatchChange(passwordsMatch);
  }, [passwordsMatch, onMatchChange]);

  return (
    <div className="password-field">
      <div className="password-field__input-wrapper">
        <input
          className="password-field__input"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={0}
          style={{
            position: "absolute",
            right: "0.8rem",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? EyeOpen : EyeClosed}
        </span>
      </div>

      <div className="password-field__input-wrapper">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          required
        />
        <span
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          tabIndex={0}
          style={{
            position: "absolute",
            right: "0.8rem",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label={
            showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showConfirmPassword ? EyeOpen : EyeClosed}
        </span>
      </div>

      {!passwordsMatch && (
        <div className="password-field__error">
          Las contraseñas no coinciden
        </div>
      )}
    </div>
  );
}

export default PasswordForm;
