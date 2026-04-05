import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./modules/auth/components/LoginForm";
import RegistrarEmpresa from "./modules/company/components/RegistrarEmpresa"
import RegistrarUsuario from "./modules/usuarios/components/RegistrarUsuario";
import EnConstruccion from "./modules/enConstruccion/components/EnConstruccion";
import PetList from "./modules/mascotas/components/PetList";
import RegisterPet from "./modules/mascotas/components/RegisterPet";
import Home from "./modules/home/components/Home";
import Informative from "./modules/informative/components/Informative";
import AgendarCita from "./modules/agenda/components/AgendarCita";
import ModificarCita from "./modules/agenda/components/ModificarCita";
import EliminarCita from "./modules/agenda/components/EliminarCita";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Informative />} />
        <Route path="/Home" element={<Home />}>
          <Route path="Mascotas/Lista" element={<PetList />} />
          <Route path="Mascotas/Registrar" element={<RegisterPet />} />
          <Route path="AgendarCita" element={<AgendarCita />} />
          <Route path="ModificarCita" element={<ModificarCita />} />
          <Route path="EliminarCita" element={<EliminarCita />} />
        </Route>
        <Route path="/Company/Login" element={<LoginForm />} />
        <Route path="/Company/Register" element={<RegistrarEmpresa />} />
        <Route path="/Person/Login" element={<LoginForm />} />
        <Route path="/Person/Register" element={<RegistrarUsuario />} />
        <Route path="/RecuperarContraseña" element={<EnConstruccion />} />
      </Routes>
    </Router>
  );
}

export default App;
