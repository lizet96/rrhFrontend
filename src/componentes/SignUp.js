import React from "react";

function SignUpForm({ onRegister }) {
  const [state, setState] = React.useState({
    nombre: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    telefono: "", 
  });

  const [error, setError] = React.useState(""); 
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [emailError, setEmailError] = React.useState(""); 
  const [phoneError, setPhoneError] = React.useState("");

  const handleChange = (evt) => {
    const { name, value } = evt.target; 
    setState({
      ...state,
      [name]: value 
    });
    if (name === "password") validatePassword(value);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial."
      );
    } else {
      setPasswordError(""); // No hay errores
    }
  };
  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };
  
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { nombre, correo, password, fechaNacimiento, telefono } = state;

    if (passwordError) {
      alert(passwordError); 
      return;
    }
 // Validación del teléfono
    if (!validatePhone(telefono)) {
      setPhoneError("El teléfono debe tener exactamente 10 dígitos y solo números.");
      return;
    }
    try {
      await onRegister(nombre, correo, password, fechaNacimiento, telefono); 
      setState({
        nombre: "",
        correo: "",
        password: "",
        fechaNacimiento: "",
        telefono: "", 
      });
      setError(""); 
      setPhoneError("");
    } catch (error) {
      console.error("Error recibido del backend:", error.message);
      if (error.message) {
        const errorMessage = error.message;      
       // Verificar si el error es del correo ya registrado
       if (errorMessage.includes("El correo electrónico ya está registrado, intenta con otro")) {
        setEmailError(errorMessage); // Mostrar error bajo el campo de correo
        alert(errorMessage); 
      } else {
        setError(errorMessage); // Mostrar error genérico
      }
    } else {
      setError("Error durante el registro. Intenta nuevamente.");
    } 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Crea tu cuenta</h1>
        <span>Usa tu correo para registrarte</span>
       
        <input
          type="text"
          name="nombre"
          value={state.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="email"
          name="correo"
          value={state.correo}
          onChange={(e) => {
            handleChange(e);
            setEmailError(""); // Limpiar el error al escribir
          }}
          placeholder="Correo"
          required
          style={{ width: '100%' }}
        />
        {error && <p className="error-message">{error}</p>} 
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: '100%' }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            style={{ flexGrow: 1, paddingRight: '30px' }} // Espacio para el ícono
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "10px", // Ícono a la derecha
              cursor: "pointer",
              zIndex: 1, // Asegura que esté encima del input
            }}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>
        {passwordError && (
          <p className="error-message">{passwordError}</p>
        )}
        <input
          type="date"
          name="fechaNacimiento"
          value={state.fechaNacimiento}
          onChange={handleChange}
          placeholder="Fecha de nacimiento"
          required
          style={{ width: '100%' }}
        />
        <input
          type="text"
          name="telefono"
          value={state.telefono}
          onChange={(e) => {
            handleChange(e);
            setPhoneError(""); // Limpiar el error de teléfono cuando escriba un nuevo valor
          }}
          placeholder="Teléfono (10 dígitos)"
          required
        />
        {phoneError && <p className="error-message">{phoneError}</p>}

        <button type="submit">Registrarse</button>
      </form>
      <style jsx>{`
      
        .form-container input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          box-sizing: border-box; /* Para que el padding no afecte el ancho */
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .error-message {
          color: red;
          font-size: 0.9rem;
          margin-top: 5px;
        }

      `}</style>
    </div>
  );
}

export default SignUpForm;
