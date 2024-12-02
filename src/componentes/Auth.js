import React, { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import { jwtDecode } from "jwt-decode";

const Auth = ({ handleLogin, handleRegister, error, type, handleOnClick }) => {
  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className={containerClass} id="container">
      <SignUpForm onRegister={handleRegister} />
      <SignInForm onLogin={handleLogin} error={error} />
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Bienvenido!</h1>
            <p>
              Para mantenerse conectado con nosotros, inicie sesión con su información personal
            </p>
            <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
              Iniciar sesión
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>¿Aún no tienes cuenta?</h1>
            <p>Ingresa tus datos personales y comienza un viaje con nosotros</p>
            <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
