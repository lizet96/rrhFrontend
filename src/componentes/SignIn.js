import React from "react";

function SignInForm({ onLogin, error }) {
  const [state, setState] = React.useState({
    correo: "",
    password: ""
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { correo, password } = state;

    try {
      await onLogin(correo, password); // Llamar a la función onLogin que viene de App.js
      setState({ correo: "", password: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Iniciar sesión</h1>
        <input
          type="email"
          placeholder="correo"
          name="correo"
          value={state.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={state.password}
          onChange={handleChange}
          required
        />
        <a href="#">Olvidaste tu contraseña?</a>
        <button type="submit">Iniciar sesión</button>
        {error && <p className="error">{error}</p>} {/* Mostrar errores */}
      </form>
    </div>
  );
}

export default SignInForm;
