// FUNCIONES CRUD (INTERACCIÓN CON EL SERVIDOR)
const url = "http://localhost:3000";

// OBTENER DATOS DE UN ENDPOINT
export async function obtenerDatos(endpoint) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return [];
  }
}

// CREAR UN NUEVO REGISTRO EN EL SERVIDOR
export async function crearDato(endpoint, datos) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(datos),
    });
    return respuesta.json();
  } catch (error) {
    console.log("Error al crear dato:", error);
  }
}

// EDITAR UN REGISTRO EXISTENTE
export async function editarDato(endpoint, id, datos) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al editar dato:", error);
  }
}

// EDITAR UN REGISTRO EXISTENTE
export async function editarUnicoDato(endpoint, id, datos) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al editar dato:", error);
  }
}

// Desactivar UN REGISTRO DEL SERVIDOR
export async function desactivarDato(endpoint, id) {
  try {
    const response = await fetch(`${url}/${endpoint}/${id}`, {
      method: "PATCH",
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error al desactivar dato:", error);
  }
}
// ELIMINAR UN REGISTRO DEL SERVIDOR
export async function eliminarDato(endpoint, id) {
  try {
    const response = await fetch(`${url}/${endpoint}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar dato:", error);
  }
}