import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      setMessage("Token no proporcionado.");
      setLoading(false);
      return;
    }

    // Actualizar la URL en la solicitud a la nueva ruta de verificación en el backend
    axios
      .get(`https://rrhbackend.onrender.com/api/auth/verify-email?token=${token}`)
      .then((response) => {
        setMessage(response.data.message);
        setLoading(false);
        setTimeout(() => {
          history.push("/login"); 
        }, 2000);
      })
      .catch((error) => {
        setMessage(error.response.data.error || "Error desconocido");
        setLoading(false);
      });
  }, [history]);

  return (
    <div className="verify-email-container">
      {loading ? (
        <p>Verificando...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default VerifyEmail;
