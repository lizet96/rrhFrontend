import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import './estilos/inicioSesion.css';  // Importar el archivo CSS adicional
import { useNavigate } from 'react-router-dom';

export default function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shifted, setShifted] = useState(false);  // Estado para controlar el desplazamiento

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleFocus = () => {
    setShifted(true);  // Desplazar imagen y formulario
  };

  const handleBlur = () => {
    if (!email && !password) {
      setShifted(false);  // Restablecer el desplazamiento si ambos campos están vacíos
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#155062' }}  // Fondo suave
    >
      <MDBCard
        style={{
          width: '900px',
          margin: 'auto',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          display: 'flex',  // Flexbox para centrar
          
        }}
      >
        <MDBRow className="g-0">
          <MDBCol md="6" className={`image-col ${shifted ? 'shift-left' : ''}`}>
            <MDBCardImage
              src="/login.jpeg"
              alt="login form"
              className="rounded-start w-100"
              style={{
                objectFit: 'cover',
                height: '100%',
                borderRadius: '20px 0 0 20px',
                transition: 'transform 0.5s ease',
              }}
            />
          </MDBCol>

          <MDBCol md="6" className={`form-col ${shifted ? 'shift-left' : ''} d-flex align-items-center justify-content-center`}>
            <MDBCardBody className="d-flex flex-column p-4">
              <div className="d-flex flex-row justify-content-center mb-3">
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#00796b' }} />
                <span className="h1 fw-bold mb-0" style={{ color: '#1f6590' }}>
                  Bienvenido
                </span>
              </div>

              <h5 className="fw-normal mb-4" style={{ letterSpacing: '1px', color: '#555' }}>
                Inicia sesión en tu cuenta
              </h5>

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Correo electrónico"
                  id="formControlLg"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Contraseña"
                  id="formControlLg"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <MDBBtn
                  className="glow-on-hover mb-4 px-5"
                  size="lg"
                  type="submit"
                  style={{
                    color: 'white',
                    backgroundColor: '#1f6590',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  Iniciar Sesión
                </MDBBtn>zz
              </form>

              <p className="mb-5 pb-lg-2" style={{ color: '#00796b' }}>
                ¿No tienes una cuenta?{' '}
                <a href="/registro" style={{ color: '#00796b', textDecoration: 'underline' }}>
                  Regístrate aquí
                </a>
              </p>


            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}
