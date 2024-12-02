import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './estilos/registro.css'; // Importa el archivo CSS

export default function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías agregar lógica para manejar el registro
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    
    // Redireccionar a la página de inicio de sesión después del registro
    navigate('/login');
  };

  return (
    <MDBContainer
      fluid
      className='d-flex align-items-center justify-content-center bg-image'
      style={{
        backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)',
        minHeight: '100vh'
      }}
    >
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">
            <MDBIcon fas icon="user-plus" /> Crear cuenta
          </h2>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass='mb-4'
              label='Tu nombre'
              size='lg'
              id='form1'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Tu correo electrónico'
              size='lg'
              id='form2'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Contraseña'
              size='lg'
              id='form3'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Repite tu contraseña'
              size='lg'
              id='form4'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className='d-flex flex-row justify-content-center mb-4'>
              <MDBCheckbox
                name='flexCheck'
                id='flexCheckDefault'
                label='Acepto todos los términos de servicio'
                required
              />
            </div>
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
                  Registarme
                </MDBBtn>
          </form>
          <p className="mb-5 pb-lg-2" style={{ color: '#00796b' }}>
                ¿Ya tienes una cuenta?{' '}
                <a href="/inicioSesion" style={{ color: '#00796b', textDecoration: 'underline' }}>
                  Iniciar Sesión
                </a>
              </p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
