import React, { useEffect, useRef, useState } from "react";
import "../styles/RegisterPet.css";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";

const petsType = [
  "Labrador Retriever",
  "Bulldog",
  "Poodle",
  "Golden Retriever",
  "Chihuahua",
  "Otro",
];

export default function RegisterPet() {
  const person = JSON.parse(localStorage.getItem("Person"));
  const [formData, setFormData] = useState({
    personId: person.id,
    name: "",
    age: "",
    animalType: "",
    race: "",
    encodedImage: "",
  });
  const [animalTypes, setAnimalTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const res = await fetch("/api/animalType/all");
        const data = await res.json();
        setAnimalTypes(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchAnimalTypes();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        // Actualiza formData con la imagen en base64
        setFormData((prev) => ({
          ...prev,
          encodedImage: reader.result, // Cambiar a undecodedImage si es necesario
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPreview(null);
    }
  };

  // ← RAZAS del tipo seleccionado (mapeo de tu breedTypes)
  const currentAnimal = animalTypes.find(
    (animal) => animal.id === parseInt(selectedAnimalType),
  );
  const breeds = currentAnimal
    ? currentAnimal.breedTypes.map((bt) => bt.name)
    : [];

  const handleAnimalChange = (e) => {
    const value = e.target.value;
    setSelectedAnimalType(value);
    setSelectedBreed("");
  };

  const handleBreedChange = (e) => {
    setSelectedBreed(e.target.value);
  };

  const handleFotoClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

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
    // Aquí puedes manejar el envío del formulario
    try {
      console.log(formData);
      const response = await apiService.post("api/pet", formData);

      if (!response) {
        setModalMessage("¡Mascota registrada exitosamente!");
        setModalType("success");
      }
      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al momento de registrar el usuario");
    }

    // alert(`Mascota registrada: ${nombre}, ${edad} años, ${raza}`);
  };

  return (
    <>
      <form className="pet-form" onSubmit={handleSubmit}>
        <div className="pet-photo-container">
          <img
            src={fotoPreview}
            alt="Foto de la mascota"
            className="pet-photo"
          />
        </div>
        <button className="upload-btn" onClick={handleFotoClick} type="button">
          Cargar Foto
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFotoChange}
        />

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Edad (años)</label>
          <input
            type="number"
            name="age"
            min="0"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo de Animal</label>
          <select
            name="animalType"
            value={selectedAnimalType}
            onChange={handleAnimalChange}
            required
          >
            <option value="">Selecciona un tipo de animal</option>
            {animalTypes.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Raza</label>
          <select
            name="race"
            value={formData.race}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona la raza del animal</option>
            {petsType.map((raza) => (
              <option key={raza} value={raza}>
                {raza}
              </option>
            ))}
          </select>
        </div>
        <button className="submit-btn" type="submit">
          Registrar Mascota
        </button>
      </form>
      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </>
  );
}
