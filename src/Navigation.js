import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import Perfil from "./vistas/Perfil";
import Vacantes from "./vistas/vacantes";
import AgregarVacante from "./vistas/agregarVacante";

export default function Navigation() {
  return (
    <Routes>
      {/* Define las rutas disponibles */}
      <Route path="/" element={<Navigate to="/inicioSesion" replace />} />
      <Route path="/inicioSesion" element={<SignInForm />} />
      <Route path="/registro" element={<SignUpForm />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/vacantes" element={<Vacantes />} />
      <Route path="/agregarVacante" element={<AgregarVacante />} />
    </Routes>
  );
}
