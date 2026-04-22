import React from "react";
import "../styles/SecurityQuestion.css";

export default function SecurityQuestion({
  questions,
  onChangeQuestion,
  onBack,
  onNext,
}) {
  const options = [
    { value: "¿Cómo se llamaba tu primera mascota?", label: "¿Cómo se llamaba tu primera mascota?" },
    { value: "¿Cuál es el segundo nombre de tu madre?", label: "¿Cuál es el segundo nombre de tu madre?" },
    { value: "¿Cuál es el segundo nombre de tu padre?", label: "¿Cuál es el segundo nombre de tu padre?" },
    { value: "¿En qué ciudad naciste?", label: "¿En qué ciudad naciste?" },
    { value: "¿Cómo se llamaba tu escuela?", label: "¿Cómo se llamaba tu escuela?" },
    { value: "¿Cuál es tu materia favorita?", label: "¿Cuál es tu materia favorita?" },
    { value: "¿Cuál es tu color favorito?", label: "¿Cuál es tu color favorito?" },
    { value: "¿Cuál es tu comida favorita?", label: "¿Cuál es tu comida favorita?" },
    { value: "¿Cuál es tu equipo favorito?", label: "¿Cuál es tu equipo favorito?" },
  ];

  return (
    <div className="step-section">
      <h3>Preguntas de Seguridad</h3>

      {questions.map((item, index) => (
        <div key={index}>
          <select
            value={item.question}
            onChange={(e) =>
              onChangeQuestion(index, "question", e.target.value)
            }
            required
            className="custom-select"
          >
            <option value="">Selecciona una pregunta</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Respuesta"
            value={item.answer}
            onChange={(e) => onChangeQuestion(index, "answer", e.target.value)}
            required
          />
        </div>
      ))}

      <div className="step-buttons">
        <button type="button" className="btn-back" onClick={onBack}>
          Retroceder
        </button>
        <button type="button" className="btn-next" onClick={onNext}>
          Continuar
        </button>
      </div>
    </div>
  );
}
