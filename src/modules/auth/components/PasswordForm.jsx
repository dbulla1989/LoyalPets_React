import { useState, useEffect, useMemo } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validation = useMemo(() => {
    const password = formData.password || "";

    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [formData.password]);

  const isPasswordStrong = Object.values(validation).every(Boolean);
  const passwordsMatch =
    !!formData.password &&
    !!formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  useEffect(() => {
    onMatchChange?.(passwordsMatch && isPasswordStrong);
  }, [passwordsMatch, isPasswordStrong, onMatchChange]);

  const ruleClass = (isValid) =>
    `password-rule ${isValid ? "password-rule--valid" : "password-rule--invalid"}`;

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
          className="password-field__input"
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

      <div className="password-field__rules">
        <div className={ruleClass(validation.minLength)}>
          {validation.minLength ? "✓" : "•"} Mínimo 8 caracteres
        </div>
        <div className={ruleClass(validation.hasLowercase)}>
          {validation.hasLowercase ? "✓" : "•"} Al menos 1 letra minúscula
        </div>
        <div className={ruleClass(validation.hasUppercase)}>
          {validation.hasUppercase ? "✓" : "•"} Al menos 1 letra mayúscula
        </div>
        <div className={ruleClass(validation.hasSymbol)}>
          {validation.hasSymbol ? "✓" : "•"} Al menos 1 símbolo especial (*+#$&/)
        </div>
      </div>

      {formData.confirmPassword.length > 0 && !passwordsMatch && (
        <div className="password-field__error">
          Las contraseñas no coinciden
        </div>
      )}

      {formData.password.length > 0 && !isPasswordStrong && (
        <div className="password-field__error">
          La contraseña no cumple con los requisitos de seguridad
        </div>
      )}
    </div>
  );
}

export default PasswordForm;
