import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./estilos/Cuestionario.css";
import { useNavigate } from "react-router-dom";


const Cuestionario = () => {
  const { id_formulario } = useParams(); // Obtener el id_formulario desde la URL
  const [preguntas, setPreguntas] = useState([]); // Estado para almacenar preguntas
  const [loading, setLoading] = useState(true); // Estado para mostrar un indicador de carga
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  
  // Usar el hook useNavigate para redirigir
  const navigate = useNavigate();

  // Efecto para obtener preguntas del backend
  useEffect(() => {
    if (!id_formulario) {
      console.error("Falta el id_formulario en la URL");
      return;
    }

    fetch(`https://rrhbackend.onrender.com/api/preguntas?id_formulario=${id_formulario}`)
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener preguntas:", error);
        setLoading(false);
      });
  }, [id_formulario]);

  // Manejar la selección de una respuesta
  const handleRespuestaSeleccionada = (preguntaId, respuestaId) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: respuestaId,
    }));
  };

  // Manejar el envío de las respuestas al backend y redirigir
  const handleSubmit = () => {
    const respuestas = Object.keys(respuestasSeleccionadas).map((preguntaId) => ({
      id_pregunta: preguntaId,
      id_respuesta: respuestasSeleccionadas[preguntaId],
    }));

    // Enviar las respuestas al backend
    fetch("https://rrhbackend.onrender.com/api/guardar_respuestas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_formulario,
        respuestas,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuestas guardadas:", data);
        
        // Redirigir a la vista de resultados
        navigate("/Resultados");
      })
      .catch((error) => {
        console.error("Error al guardar las respuestas:", error);
      });
  };

  return (
    <div className="vacante-container">
      <header className="vacante-header">
        {/* Navegación fija */}
        <div>
          <nav className="vacante-nav">
            <a href="/perfil">
              <i className="fas fa-user"></i>
              <span>Perfil</span>
            </a>
            <a href="/vacantes">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="/agregarVacante">
              <i className="fas fa-plus-circle"></i>
              <span>Agregar Vacante</span>
            </a>
            <a href="/Resultados">
              <i className="fas fa-chart-bar"></i>
              <span>Resultados</span>
            </a>
          </nav>
        </div>
        <div className="header-content">
          <span className="admin-text"></span>
          <img
            src="https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg?w=360"
            alt="User"
            className="perfil-image"
          />
        </div>
      </header>

      <div className="vacante-body">
        <div className="vacante-content">
          <h2 className="section-title">
            Cuestionario
            <i
              className="fas fa-file-alt"
              style={{ marginLeft: "15px", fontSize: "2rem", color: "#333" }}
            ></i>
          </h2>
          {loading ? (
            <p>Cargando preguntas...</p>
          ) : preguntas.length > 0 ? (
            <div className="preguntas-container">
              {preguntas.map((pregunta) => (
                <div key={pregunta.id_pregunta} className="pregunta-item">
                  <p>{pregunta.texto_pregunta}</p>

                  {/* Mostrar respuestas debajo de la pregunta */}
                  {pregunta.respuestas && pregunta.respuestas.length > 0 ? (
                    <div className="respuesta-opciones">
                      {pregunta.respuestas.map((respuesta) => (
                        <button
                          key={respuesta.id_respuesta}
                          className={`respuesta-boton ${
                            respuestasSeleccionadas[pregunta.id_pregunta] ===
                            respuesta.id_respuesta
                              ? "seleccionado"
                              : ""
                          }`}
                          onClick={() =>
                            handleRespuestaSeleccionada(
                              pregunta.id_pregunta,
                              respuesta.id_respuesta
                            )
                          }
                        >
                          {respuesta.opcion_respuesta}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p>No hay respuestas disponibles</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay preguntas disponibles para este formulario.</p>
          )}
          {/* Botón para enviar las respuestas */}
          <button onClick={handleSubmit} className="enviar-respuestas-boton">
            Enviar respuestas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cuestionario;
