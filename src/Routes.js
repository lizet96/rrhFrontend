import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInForm from "./componentes/SignIn";
import SignUpForm from "./componentes/SignUp";
import Perfil from "./vistas/Perfil";
import Vacantes from "./vistas/vacantes";
import AgregarVacante from "./vistas/agregarVacante";

const AppRoutes = ({ user, onLogin, onRegister, type, setType, error, handleOnClick, view, setView }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Manejar el inicio de sesión y redirigir a vacantes
  const handleLogin = (userData) => {
    onLogin(userData); // Llamar al callback de onLogin para guardar los datos del usuario
    setIsLoggedIn(true); // Cambiar el estado de isLoggedIn a true
    setView("vacantes"); // Cambiar la vista a vacantes
  };

  return (
    <Routes>
      {view === "auth" ? (
        <>
          {/* Rutas para autenticación */}
          <Route 
            path="/" 
            element={
              <div className={`container ${type === "signUp" ? "right-panel-active" : ""}`} id="container">
                <SignUpForm onRegister={onRegister} />
                <SignInForm onLogin={handleLogin} error={error} />
                <div className="overlay-container">
                  <div className="overlay">
                    <div className="overlay-panel overlay-left">
                      <h1>Bienvenido!</h1>
                      <p>
                        Para mantenerse conectado con nosotros, inicie sesión con su información personal
                      </p>
                      <button
                        className="ghost"
                        id="signIn"
                        onClick={() => handleOnClick("signIn")}
                      >
                        Iniciar sesión
                      </button>
                    </div>
                    <div className="overlay-panel overlay-right">
                      <h1>¿Aún no tienes cuenta?</h1>
                      <p>Ingresa tus datos personales y comienza un viaje con nosotros</p>
                      <button
                        className="ghost"
                        id="signUp"
                        onClick={() => handleOnClick("signUp")}
                      >
                        Registrarse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </>
      ) : view === "perfil" ? (
        <Route path="/perfil" element={<Perfil user={user} />} />
      ) : view === "vacantes" ? (
        <Route path="/vacantes" element={<Vacantes setView={setView} user={user} />} />
      ) : view === "agregarVacante" ? (
        <Route path="/agregarVacante" element={<AgregarVacante setView={setView} user={user} />} />
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
