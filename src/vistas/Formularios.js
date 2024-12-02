import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./estilos/Formularios.css";

const Formularios = () => {
  const [formularios, setFormularios] = useState([]); 
  const [selectedFormulario, setSelectedFormulario] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const { vacante_id } = useParams(); 
  const navigate = useNavigate(); 

  // Hacer la solicitud a la API para obtener los formularios
  useEffect(() => {
    if (!vacante_id) {
      console.error("Falta el id_vacante en la URL");
      return;
    }

    fetch(`https://rrhbackend.onrender.com/api/formularios?vacante_id=${vacante_id}`)
      .then((response) => response.json())
      .then((data) => setFormularios(data))
      .catch((error) => console.error("Error al obtener formularios:", error));
  }, [vacante_id]);

  // Función para manejar clic en los botones de navegación
  const handleRedirectToPerfil = () => navigate("/perfil");
  const handleRedirectToHome = () => navigate("/vacantes");
  const handleRedirectToAgregarVacante = () => navigate("/agregar-vacante");
  const handleRedirectToResultados = () => navigate("/resultados");

  // Mostrar la ventana modal con el formulario seleccionado
  const handleFormularioClick = (formulario) => {
    setSelectedFormulario(formulario);
    setShowModal(true); 
  };

  // Acción para el botón "Empezar"
  const handleEmpezar = () => {
    if (selectedFormulario) {
      navigate(`/cuestionario/${selectedFormulario.id_formulario}`); 
    }
    setShowModal(false); 
  };

  // Acción para el botón "Cancelar"
  const handleCancelar = () => {
    setSelectedFormulario(null);
    setShowModal(false); 
  };

  return (
    <div className="vacante-container">
      <header className="vacante-header">
        <div>
          <nav className="vacante-nav">
            <button className="nav-link" onClick={handleRedirectToPerfil}>
              <i className="fas fa-user"></i>
              <span>Perfil</span>
            </button>
            <button className="nav-link" onClick={handleRedirectToHome}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </button>
            <button className="nav-link" onClick={handleRedirectToAgregarVacante}>
              <i className="fas fa-plus-circle"></i>
              <span>Agregar Vacante</span>
            </button>
            <button className="nav-link" onClick={handleRedirectToResultados}>
              <i className="fas fa-chart-bar"></i>
              <span>Resultados</span>
            </button>
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

      <div className="formularios-container">
        <h1>Formularios</h1>
        <div className="formularios-list">
          {formularios.length > 0 ? (
            formularios.map((formulario) => (
              <div
                key={formulario.id_formulario}
                className="formulario-card"
                onClick={() => handleFormularioClick(formulario)}
              >
                <h2>{formulario.for_nombre}</h2>
                <p>{formulario.for_descripcion}</p>
              </div>
            ))
          ) : (
            <p>No hay formularios disponibles para esta vacante.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Quieres empezar con el formulario?</h2>
            <p>Dispones de 1 hora para terminar.</p>
            <div className="modal-buttons">
              <button className="btn btn-green" onClick={handleEmpezar}>
                Empezar
              </button>
              <button className="btn btn-red" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {formularios.length > 0 && (
        <button className="btn btn-start" onClick={handleEmpezar}>
          Empezar formulario
        </button>
      )}
    </div>
  );
};

export default Formularios;
