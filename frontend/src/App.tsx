import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactList from "./pages/ContactList";
import ContactDetails from "./pages/ContactDetails";
import ContactForm from "./pages/ContactForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ContactList />} />
        <Route path="/contacts/:id" element={<ContactDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/contacts/new" element={<ContactForm />} />
          <Route path="/contacts/:id/edit" element={<ContactForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
