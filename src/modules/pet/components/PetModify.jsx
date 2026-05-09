import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSave,
  FaArrowLeft,
  FaBars,
} from "react-icons/fa";

import Menu from "../../layout/components/Menu";
import Titulo from "../../layout/components/Titulo";
import apiService from "../../core/resources/GlobalResource";

import "../styles/PetModify.css";

export default function PetModify () {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    age: "",
    animalTypeId: "",
    breedTypeId: "",
    encodedImage: "",
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        id: pet.id || "",
        name: pet.name || "",
        age: pet.age || "",
        animalTypeId: pet.animalType?.id || "",
        breedTypeId: pet.breedType?.id || "",
        encodedImage: pet.encodedImage || pet.photo || "",
      });
    }
  }, [pet]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        encodedImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        id: formData.id,
        age: Number(formData.age),
        animalTypeId: formData.animalTypeId,
        breedTypeId: formData.breedTypeId,
        encodedImage: formData.encodedImage,
      };

      await apiService.put(
        `api/pet/${formData.id}`,
        payload,
      );

      alert("Mascota actualizada correctamente");

      navigate("/Person/Pet/Details", {
        state: {
          pet: {
            ...pet,
            ...formData,
          },
        },
      });
    } catch (error) {
      console.error(error);
      alert("Error actualizando la mascota");
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return <div>No se encontró información de la mascota</div>;
  }

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
          <Titulo pageTitle="Editar Mascota" />
        </header>

        <div className="edit-pet-container">
          <form className="edit-pet-form" onSubmit={handleSubmit}>
            <div className="image-section">
              <div className="image-container">
                <img
                  src={formData.encodedImage}
                  alt={formData.name}
                  className="pet-image"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Nombre</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Edad</label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tipo Animal</label>

                <input
                  type="text"
                  value={pet.animalType?.name || ""}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Raza</label>

                <input
                  type="text"
                  value={pet.breedType?.name || ""}
                  disabled
                />
              </div>

              <div className="buttons-container">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft />
                  Volver
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  <FaSave />

                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};