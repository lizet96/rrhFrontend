import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../vistas/estilos/Frame.module.css';
import People from '../assets/people.png'
import Camara from '../assets/camara.png'
import Folder from '../assets/folder.png'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Perfil = ({ setView, user }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Para la imagen temporal
  const [profileImage, setProfileImage] = useState(People); // Para la imagen guardada del usuario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState('');
const [nuevaContrasena, setNuevaContrasena] = useState('');
const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const extractedUserId = decodedToken.id_usuario;
      setUserId(extractedUserId);
  
      // Llama a la API para obtener la información del perfil
      axios
        .get('https://rrhbackend.onrender.com/api/profile/get-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log("Respuesta de la API:", response.data);
          if (response.data) {
            const { us_nombre, us_apellido, us_correo, us_foto,telefono } = response.data;
            setNombre(us_nombre);
            setApellido(us_apellido);
            setCorreo(us_correo);
            setProfileImage(us_foto || People);
            setTelefono(telefono);
          }
        })
        .catch(error => console.error("Error cargando la información del perfil:", error));
    } else {
      console.error("No se encontró el token. El usuario debe iniciar sesión.");
    }
  }, []);
   // Dependencia vacía, solo se ejecuta una vez al cargar el componente
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Guarda la imagen en el estado
      const fileURL = URL.createObjectURL(file);
      setProfileImage(fileURL); // Muestra la imagen en el espacio de People
    }
  };
  const handleGoBack = () => {
    navigate('/vacantes'); // Navegar a la pantalla de vacantes
  };

  const handleEditProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No tienes permisos para acceder");
      return;
    }
      
    const payload = {
      id_usuario: userId,
      us_nombre: nombre,
      us_apellido: apellido || '',
      us_correo: correo,
      telefono: telefono || '' // Provide empty string if telefono is null
    };
  
    console.log("Datos enviados al servidor:", payload);
  
    try {
      const response = await axios.put(
        'https://rrhbackend.onrender.com/api/profile/update-info', 
        payload, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Respuesta completa:', response);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error("Error al actualizar perfil:", error.response?.data || error.message);
      alert(`Error al actualizar perfil: ${error.response?.data?.message || 'Error desconocido'}`);
    }
  };

  const handleSaveImage = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No tienes permisos para acceder");
      return;
    }
  
    if (!selectedImage) {
      alert("Por favor selecciona una imagen primero");
      return;
    }
  
    console.log("Enviando imagen con los siguientes datos:");
    console.log("Token:", token);
    console.log("Imagen seleccionada:", selectedImage);
  
    const formData = new FormData();
    formData.append('us_foto', selectedImage);  
    formData.append('id_usuario', userId); 
  
    try {
      const response = await axios.put(
        'https://rrhbackend.onrender.com/api/profile/update-profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Imagen guardada correctamente');
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
      alert("Error al guardar la imagen");
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No tienes permisos para acceder");
      return;
    }
  
    if (nuevaContrasena !== confirmacionContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    try {
      const response = await axios.put(
        'https://rrhbackend.onrender.com/api/profile/update-password', // URL para actualizar la contraseña
        { 
          id_usuario: userId, 
          contrasena_actual: contrasenaActual, 
          nueva_contrasena: nuevaContrasena, 
          confirmacion_contrasena: confirmacionContrasena 
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      alert('Contraseña actualizada correctamente');
      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmacionContrasena("");
    } catch (error) {
      // Mostramos alertas detalladas según el mensaje de error que devuelve el servidor
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        if (errorMessage === 'La contraseña actual es incorrecta') {
          alert('Error: La contraseña actual ingresada es incorrecta.');
        } else if (errorMessage === 'Las contraseñas no coinciden') {
          alert('Error: La nueva contraseña y la confirmación no coinciden.');
        } else {
          alert(`Error al actualizar la contraseña: ${errorMessage}`);
        }
      } else {
        alert("Error inesperado al actualizar la contraseña");
      }
    }
  };
  const handleRedirectToHome = () => setView("vacantes");
  return (
    <div className={styles.frameParent}>
       <div className={styles.header}>
        <span className={styles.date}>{currentDate}</span>
        <button onClick={handleGoBack} className={styles.goBackButton}>
          Volver a Vacantes
        </button>
      </div>
      <button className="nav-link" onClick={handleRedirectToHome}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </button>
      <div className={styles.frameGroup}>
        <div className={styles.groupParent}>
          <img className={styles.groupIcon} alt="" src={profileImage} />
          <button className={styles.vectorParent} onClick={() => document.getElementById('fileInput').click()}>
            <img className={styles.vectorIcon} alt="" src={Folder} />
            <span className={styles.elegirArchivo}>Elegir Archivo</span>
          </button>
          <input
            type="file"
            id="fileInput"
            className={styles.hiddenInput}
            onChange={handleFileChange}
            style={{ display: 'none' }} // input esté oculto
          />

      <button className={styles.vectorGroup2} onClick={handleSaveImage}>
        <img className={styles.vectorIcon1} alt="" src={Camara} />
        <div className={styles.elegirArchivo}>Guardar foto</div>
      </button>
          <div className={styles.lizetJazminOlveraGonzlezParent}>
            <div className={styles.postulante}>Postulante</div>
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.frameDiv}>
            <div className={styles.datosPersonalesWrapper}>
              <b className={styles.elegirArchivo}>Datos personales</b>
            </div>
            <div className={styles.instanceParent}>
  <div className={styles.nombreParent}>
    <div className={styles.lizetJazminOlvera}>Nombre</div>
    <div className={styles.lizetJazminWrapper}>
      <input
        type="text"
        className={styles.elegirArchivo}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </div>
  </div>
  <div className={styles.nombreParent}>
    <div className={styles.lizetJazminOlvera}>Apellido</div>
    <div className={styles.lizetJazminWrapper}>
      <input
        type="text"
        className={styles.elegirArchivo}
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
    </div>
  </div>
  <div className={styles.nombreParent}>
    <div className={styles.lizetJazminOlvera}>Correo</div>
    <div className={styles.lizetJazminWrapper}>
      <input
        type="email"
        className={styles.elegirArchivo}
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
    </div>
  </div>
  <div className={styles.nombreParent}>
    <div className={styles.lizetJazminOlvera}>Teléfono</div>
    <div className={styles.lizetJazminWrapper}>
      <input
        type="tel"
        className={styles.elegirArchivo}
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        />
    </div>
  </div>
</div>

          </div>
          <button
            className={styles.editarPerfilWrapper} 
            onClick={handleEditProfile} 
            type="button"
            style={{ textTransform: 'none' }} // Sobrescribe la transformación de texto
          >
            <b className={styles.editarPerfil}>Editar perfil</b>
          </button>

         
        </div>
      </div>
      <div className={styles.editarContraseaParent}>
        <b className={styles.editarContrasea}>Editar contraseña</b>
        <div className={styles.frameParent1}>
          <div className={styles.instanceGroup}>
            <div className={styles.nombreParent}>
              <div className={styles.lizetJazminOlvera}>Contraseña actual</div>
              <div className={styles.lizetJazminWrapper}>
              <input
                id="contrasena_actual"
                type="password"
                className={styles.elegirArchivo}
                placeholder="Ingrese contraseña"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)} // Actualiza el estado
              />
              </div>
            </div>
            <div className={styles.nombreParent}>
              <div className={styles.lizetJazminOlvera}>Nueva contraseña</div>
              <div className={styles.lizetJazminWrapper}>
              <input
                id="nueva_contrasena"
                type="password"
                className={styles.elegirArchivo}
                placeholder="Ingrese la nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)} // Actualiza el estado
              />
              </div>
            </div>
          </div>
          <div className={styles.nombreParent}>
            <div className={styles.lizetJazminOlvera}>Confirme contraseña</div>
            <div className={styles.lizetJazminWrapper}>
            <input
              id="confirmacion_contrasena"
              type="password"
              className={styles.elegirArchivo}
              placeholder="Confirme la contraseña"
              value={confirmacionContrasena}
              onChange={(e) => setConfirmacionContrasena(e.target.value)} // Actualiza el estado
            />
            </div>
          </div>
        </div>
        <button
          className={styles.editarContraseaWrapper} 
          onClick={handleChangePassword}
          type="button"
          style={{ textTransform: 'none' }}
        >
          <b className={styles.editar}>Editar contraseña</b>
        </button>
      </div>
    </div>
  );
};

export default Perfil;
