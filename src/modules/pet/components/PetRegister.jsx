import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import {
  FaBars,
  FaCalendarPlus,
  FaUsers,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import apiService from "../../core/resources/GlobalResource";
import AlertNotification from "../../alertNotification/components/AlertNotification";
import "../styles/PetRegister.css";

export default function PetRegister() {
  const user = JSON.parse(localStorage.getItem("User"));
  const [formData, setFormData] = useState({
    personId: user.personId,
  });
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [otherBreed, setOtherBreed] = useState("");
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimalType, setSelectedAnimalType] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedBreedId, setSelectedBreedId] = useState("");
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
        const response = await apiService.get("api/AnimalType/all");
        const sortedAnimalTypes = (response.data || [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        setAnimalTypes(sortedAnimalTypes);
        setLoading(false);
      } catch (err) {
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
        setFormData((prev) => ({
          ...prev,
          encodedImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPreview(null);
    }
  };

  const handleAnimalChange = (e) => {
    setSelectedAnimalType(e.target.value);

    const currentAnimal = animalTypes.find(
      (animal) => animal.id === e.target.value,
    );
    const newBreeds = currentAnimal
      ? currentAnimal.breedTypes
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

    setBreeds(newBreeds);
    setSelectedBreed("");
  };

  const handleBreedChange = (e) => {
    const currentBreed = breeds.find(
      (breed) => breed.id === e.target.value,
    ).name;
    setSelectedBreedId(e.target.value);
    setSelectedBreed(currentBreed);
  };

  const handleFotoClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      navigate("/Person/Home");
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

    let finalRace = formData.race;

    if (selectedBreed === "Otro") {
      const trimmedOther = otherBreed.trim();
      if (!trimmedOther) {
        alert("Por favor especifique la raza.");
        return;
      }
      finalRace = trimmedOther;
    }

    const payload = {
      ...formData,
      otherBreed: finalRace,
    };

    try {
      const response = await apiService.post("api/pet", payload);
      if (response.status === 200) {
        setModalMessage("¡Mascota registrada exitosamente!");
        setModalType("success");
      }

      if (response.status === 500){
        setModalMessage("¡Se ha generado un error al momento de registrar la mascota!");
        setModalType("error");
      }
      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al momento de registrar el usuario");
    }
  };

  if (loading) return <div>Cargando tipos de animales...</div>;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="top-section">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <Menu isOpen={sidebarOpen} />
      </aside>
      <div className="content-area">
        <header className="header">
          <Titulo pageTitle="Menú Principal" />
        </header>
        <main className="main-content">
          <form className="pet-form" onSubmit={handleSubmit}>
            <div className="pet-photo-container">
              <img
                src={fotoPreview}
                alt="Foto de la mascota"
                className="pet-photo"
              />
            </div>
            <button
              className="upload-btn"
              onClick={handleFotoClick}
              type="button"
            >
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
                name="animalTypeId"
                value={selectedAnimalType}
                onChange={(e) => {
                  handleAnimalChange(e);
                  handleChange(e);
                }}
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
                name="breedTypeId"
                value={selectedBreedId}
                onChange={(e) => {
                  handleBreedChange(e);
                  handleChange(e);
                }}
                required
              >
                <option value="">Selecciona la raza del animal</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedBreed === "Otro" && (
              <div className="form-group">
                <label>Especifique la raza</label>
                <input
                  type="text"
                  name="otherBreed"
                  value={otherBreed}
                  onChange={(e) => setOtherBreed(e.target.value)}
                  placeholder="Ingrese la raza"
                  required
                />
              </div>
            )}

            <button className="submit-btn" type="submit">
              Registrar Mascota
            </button>
          </form>
        </main>
      </div>

      <AlertNotification
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </div>
  );
}
