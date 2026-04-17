import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./modules/auth/components/LoginForm";
import PetList from "./modules/pet/components/PetList";
import PetRegister from "./modules/pet/components/PetRegister";
import { PersonHome, PersonModify, PersonRegister } from "./modules/person";
import Informative from "./modules/informative/components/Informative";
import {
  CompanyHome,
  CompanyModify,
  CompanyRegister,
  CompanyRemove,
} from "./modules/company/";
import {
  AppointmentCancel,
  AppointmentModify,
  AppointmentSchedule,
} from "./modules/appointments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Informative />} />
        <Route path="Person">
          <Route path="Home" element={<PersonHome />} />
          <Route path="Login" element={<LoginForm />} />
          <Route path="Register" element={<PersonRegister />} />
          <Route path="Pet">
            <Route path="List" element={<PetList />} />
            <Route path="Register" element={<PetRegister />} />
            <Route path="Modify" element={<PetRegister />} />
            <Route path="Remove" element={<PetRegister />} />
          </Route>
          <Route path="Appointment">
            <Route path="Register" element={<AppointmentSchedule />} />
            <Route path="Modify" element={<AppointmentModify />} />
            <Route path="Cancel" element={<AppointmentCancel />} />
          </Route>
        </Route>
        <Route path="Company">
          <Route path="Home" element={<CompanyHome />} />
          <Route path="Login" element={<LoginForm />} />
          <Route path="Register" element={<CompanyRegister />} />
          <Route path="Veterinary">
            <Route path="Register" element={<CompanyRegister />} />
            <Route path="Modify" element={<CompanyModify />} />
            <Route path="Remove" element={<CompanyRemove />} />
          </Route>
          <Route path="Planner">
            <Route path="Calendar" element={<CompanyRegister />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
