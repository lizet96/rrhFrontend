// Lógica para interactuar con la API en el backend
export const saveRespuestas = (id_formulario, respuestas) => {
    return fetch("https://rrhbackend.onrender.com/api/guardar_respuestas", {
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
        return data;
      })
      .catch((error) => {
        console.error("Error al guardar las respuestas:", error);
        throw error;
      });
  };
  