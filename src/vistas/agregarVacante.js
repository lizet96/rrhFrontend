// agregarVacante.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilos/agregarVacante.css";

const AgregarVacante = ({ setView, user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vac_nombre: "",
    vac_descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    sueldoMensual: "",
    id_empresa: "",
    id_categoria: "",
    habilidades: [],
  });

  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    fetch("https://rrhbackend.onrender.com/api/empresas")
      .then((response) => response.json())
      .then((data) => setEmpresas(data))
      .catch((error) => console.error("Error al obtener las empresas:", error));

    fetch("https://rrhbackend.onrender.com/api/categorias")
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener las categorías:", error));

    fetch("https://rrhbackend.onrender.com/api/habilidades")
      .then((response) => response.json())
      .then((data) => setHabilidades(data))
      .catch((error) => console.error("Error al obtener las habilidades:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => {
        const nuevasHabilidades = checked
          ? [...prevState.habilidades, parseInt(value)]
          : prevState.habilidades.filter((habilidad) => habilidad !== parseInt(value));
        return {
          ...prevState,
          habilidades: nuevasHabilidades,
        };
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.habilidades.length === 0) {
      alert("Debes seleccionar al menos una habilidad.");
      return;
    }
  
    try {
      // Crear la vacante
      console.log('Enviando datos de vacante:', {
        vac_nombre: formData.vac_nombre,
        vac_descripcion: formData.vac_descripcion,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        sueldoMensual: formData.sueldoMensual,
        id_empresa: formData.id_empresa,
        id_categoria: formData.id_categoria,
      });
      
      const vacanteResponse = await fetch("https://rrhbackend.onrender.com/api/vacante", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vac_nombre: formData.vac_nombre,
          vac_descripcion: formData.vac_descripcion,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin,
          sueldoMensual: formData.sueldoMensual,
          id_empresa: formData.id_empresa,
          id_categoria: formData.id_categoria,
        }),
      });
  
      const vacanteData = await vacanteResponse.json();
      console.log('Respuesta de vacante:', vacanteData);
  
      if (!vacanteResponse.ok) {
        console.error("Error al guardar la vacante:", vacanteData);
        alert(`Error al guardar la vacante: ${vacanteData.message}`);
        return;
      }
  
      const id_vacante = vacanteData?.id_vacante;
  
      if (!id_vacante) {
        console.error("ID de vacante no recibido:", vacanteData);
        alert("Error al obtener el ID de la vacante. Verifica el servidor.");
        return;
      }
  
      // Asociar habilidades a la vacante
      console.log('Asociando habilidades con ID de vacante:', id_vacante, 'Habilidades:', formData.habilidades);
  
      const requests = formData.habilidades.map((id_habilidad) =>
        fetch("https://rrhbackend.onrender.com/api/vacantehabilidad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_vacante, id_habilidad }),
        })
      );
  
      const results = await Promise.allSettled(requests);
  
      const errores = results.filter((result) => result.status === "rejected" || (result.value && !result.value.ok));
      if (errores.length > 0) {
        console.error("Errores al asociar habilidades:", errores);
        alert("Algunas habilidades no pudieron asociarse. Revisa los logs para más información.");
      } else {
        alert("Vacante y habilidades guardadas con éxito.");
        resetForm(); // Limpiar el formulario después de un envío exitoso
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  

  const resetForm = () => {
    setFormData({
      vac_nombre: "",
      vac_descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      sueldoMensual: "",
      id_empresa: "",
      id_categoria: "",
      habilidades: [],
    });
  };
 // Función para redirigir al perfil
 const handleRedirectToPerfil = () => setView("perfil");

 // Función para redirigir a la vista de agregar vacante
 const handleRedirectToAgregarVacante = () => setView("agregarVacante");

 // Función para redirigir a la vista de resultados
 const handleRedirectToResultados = () => navigate('/Resultados');
  const handleRedirectToHome = () => setView("vacantes");
  const userRol = user?.role || ''; 
  return (
    <div className="vacantes-container">
      <header className="vacantes-header">
        <div>
        <nav className="vacante-nav">
          {/* Condicional para el rol del usuario */}
          {userRol === 'cliente' ? (
            <>
              <button className="nav-link" onClick={handleRedirectToPerfil}>
                <i className="fas fa-user"></i>
                <span>Perfil</span>
              </button>
              <button className="nav-link">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </button>
            </>
          ) : userRol === 'admin' ? (
            <>
              <button className="nav-link" onClick={handleRedirectToAgregarVacante}>
                <i className="fas fa-plus-circle"></i>
                <span>Agregar Vacante</span>
              </button>
              <button className="nav-link" onClick={handleRedirectToResultados}>
                <i className="fas fa-chart-bar"></i>
                <span>Resultados</span>
              </button>
            </>
          ) : (
            <p>Por favor, inicie sesión o verifique su rol.</p>
          )}
        </nav>
        </div>
        <div className="user-info">
          <img
            src="https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg?w=360"
            alt="User"
            className="user-photo"
          />
          <span className="user-name">{user?.nombre}</span>
        </div>
      </header>

      <div className="vacante-body">
        <div className="vacante-content">
          <h2 className="section-title">Agregar Vacante</h2>
          <form onSubmit={handleSubmit}>
            <div className="vacante-form">
              <div className="column">
                <div className="input-group">
                  <label>Nombre de la Vacante:</label>
                  <input
                    type="text"
                    name="vac_nombre"
                    value={formData.vac_nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Descripción:</label>
                  <input
                    type="text"
                    name="vac_descripcion"
                    value={formData.vac_descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Fecha de Inicio:</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Fecha de Fin:</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="column">
                <div className="input-group">
                  <label>Sueldo Mensual:</label>
                  <input
                    type="number"
                    name="sueldoMensual"
                    value={formData.sueldoMensual}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="id_empresa">Empresa</label>
                  <select
                    id="id_empresa"
                    name="id_empresa"
                    value={formData.id_empresa}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Seleccione una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id_empresa} value={empresa.id_empresa}>
                        {empresa.emp_nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="id_categoria">Categoría</label>
                  <select
                    id="id_categoria"
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.cat_nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Habilidades Requeridas</label>
                  <div className="habilidades-checkboxes">
                    {habilidades.map((habilidad) => (
                      <div key={habilidad.id_habilidad} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`habilidad-${habilidad.id_habilidad}`}
                          name="habilidades"
                          value={habilidad.id_habilidad.toString()}
                          onChange={handleChange}
                          checked={formData.habilidades.includes(parseInt(habilidad.id_habilidad))}
                        />
                        <label htmlFor={`habilidad-${habilidad.id_habilidad}`}>
                          {habilidad.hab_nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="submit-button">
              <button type="submit" className="btn-submit">Guardar Vacante</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarVacante;
