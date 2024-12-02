import React, { useState } from "react";
import "./Styles.css";
import { jwtDecode } from "jwt-decode";
import Perfil from "./vistas/Perfil";
import Vacantes from "./vistas/vacantes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgregarVacante from "./vistas/agregarVacante";
import Formularios from "./vistas/Formularios";
import Cuestionario from "./vistas/Cuestionario";
import Resultados from './vistas/Resultados';
import Auth from "./componentes/Auth"; // Importar el componente de autenticación

export default function App() {
  const [type, setType] = useState("signIn");
  const [user, setUser] = useState(null); 
  const [error, setError] = useState(""); 
  const [view, setView] = useState("auth");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      setError(""); 
    }
  };

  const handleLogin = async (correo, password) => {
    try {
      const response = await fetch("https://rrhbackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Usuario no encontrado") {
          setError("El usuario no existe.");
        } else if (errorData.error === "Contraseña incorrecta") {
          setError("La contraseña ingresada es incorrecta.");
        } else if (errorData.error === "Por favor verifica tu correo electrónico antes de iniciar sesión.") {
          setError("Por favor verifica tu correo electrónico antes de iniciar sesión.");
        } else {
          setError(errorData.error || "Error al iniciar sesión");
        }
        return;
      }
  
      const { message, token } = await response.json();
      console.log(message);
      localStorage.setItem("token", token);
   // Decodificar el token y extraer los datos del usuario
   const decodedUser = jwtDecode(token); // Aquí extraes el payload del token
   console.log(decodedUser); // Muestra en consola los datos decodificados
   setUser(decodedUser); 
     // Si el rol es admin, redirigimos a agregar vacante
    if (decodedUser.role === 'admin') {
      setView("agregarVacante"); // Redirige a "agregarVacante" si es admin
    } else {
      setView("vacantes"); // Redirige a "vacantes" si es cliente
    }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      setError("Error inesperado al iniciar sesión");
    }
  };
  
  const handleRegister = async (name, email, password, fechaNacimiento, telefono) => {
    try {
      const response = await fetch("https://rrhbackend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, fechaNacimiento, telefono }), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "El correo ya existe, intenta con otro");
      }
  
      alert("Registro exitoso, verifica tu correo para poder iniciar sesión.");
      setType("signIn");
    } catch (error) {
      setError(error.message);
      throw error; 
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        {view === "auth" && (
          <h2 onClick={() => setView("vacantes")} style={{ cursor: "pointer" }}>
            Reclutamiento Inteligente
          </h2>
        )}

        {/* Mostrar el componente de autenticación solo si la vista es 'auth' */}
        {view === "auth" && (
          <Auth
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            error={error}
            type={type}
            handleOnClick={handleOnClick}
          />
        )}

        {/* Rutas de las vistas adicionales */}
        {view === "perfil" && <Perfil setView={setView} user={user} />}
        {view === "vacantes" && <Vacantes setView={setView} user={user} />}
        {view === "agregarVacante" && <AgregarVacante setView={setView} user={user} />}
        {/* Rutas de formularios y cuestionarios */}
        <Routes>
        <Route path="/formularios/:vacante_id" element={<Formularios user={user}setView={setView} />} />
          <Route path="/cuestionario/:id_formulario" element={<Cuestionario />} />
        <Route path="/resultados" element={<Resultados />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
