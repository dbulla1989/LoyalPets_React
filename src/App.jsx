import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm, ResetPassword } from "./modules/auth";
import PetList from "./modules/pet/components/PetList";
import HelpPage from "./modules/help/components/HelpPage";
import MyCalendar from "./modules/calendars/components/MyCalendar";
import { PetRegister, PetDetails, PetModify } from "./modules/pet/";
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
import { VeterinaryRegister, VeterinaryList } from "./modules/veterinary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Informative />} />
        <Route path="Person">
          <Route path="Home" element={<PersonHome />} />
          <Route path="Login" element={<LoginForm />} />
          <Route path="MyCalendar" element={<MyCalendar />} />
          <Route path="HelpPage" element={<HelpPage />} />
          <Route path="ResetPassword" element={<ResetPassword />} />
          <Route path="Register" element={<PersonRegister />} />
          <Route path="Modify" element={<PersonModify />} />
          <Route path="Pet">
            <Route path="List" element={<PetList />} />
            <Route path="Register" element={<PetRegister />} />
            <Route path="Details" element={<PetDetails />} />
            <Route path="Modify" element={<PetModify />} />
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
          <Route path="ResetPassword" element={<ResetPassword />} />
          <Route path="HelpPage" element={<HelpPage />} />
          <Route path="Register" element={<CompanyRegister />} />
          <Route path="Modify" element={<CompanyModify />} />
          <Route path="Veterinary">
            <Route path="List" element={<VeterinaryList />} />
            <Route path="Register" element={<VeterinaryRegister />} />
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
