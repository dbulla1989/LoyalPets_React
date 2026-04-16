import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./modules/auth/components/LoginForm";
import RegisterCompany from "./modules/company/components/RegisterCompany";
import RegisterPerson from "./modules/person/components/RegisterPerson";
import PetList from "./modules/pet/components/PetList";
import PetRegister from "./modules/pet/components/RegisterPet";
import PersonHome from "./modules/person/components/HomePerson";
import CompanyHome from "./modules/company/components/HomeCompany";
import Informative from "./modules/informative/components/Informative";
import ScheduleAppointment from "./modules/appointments/components/ScheduleAppointment";
import ModifyAppointment from "./modules/appointments/components/ModifyAppointment";
import CancelAppointment from "./modules/appointments/components/CancelAppointment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Informative />} />
        <Route path="Person/Home" element={<PersonHome />}>
          <Route path="PetList" element={<PetList />} />
          <Route path="PetRegister" element={<PetRegister />} />
          <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />
          <Route path="ModifyAppointment" element={<ModifyAppointment />} />
          <Route path="CancelAppointment" element={<CancelAppointment />} />
        </Route>
        <Route path="/Company/Home" element={<CompanyHome />}>

        </Route>
        <Route path="/Company/Login" element={<LoginForm />} />
        <Route path="/Company/Register" element={<RegisterCompany />} />
        <Route path="/Person/Login" element={<LoginForm />} />
        <Route path="/Person/Register" element={<RegisterPerson />} />
      </Routes>
    </Router>
  );
}

export default App;
