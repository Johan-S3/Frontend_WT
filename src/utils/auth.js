import { obtenerDatos } from "../helpers/peticiones";

export const isAuth = async () => {
  try {
    let response = await obtenerDatos("auth/protected");

    // Verifica si fue exitoso
    if (response.success) return true;

    if (response.authError === "TOKEN_EXPIRED") {

      const refresh = await refreshToken();
      if (!refresh) return false;

      response = await obtenerDatos("auth/protected");
      return response.success;
    }

    if (response.authError === "TOKEN_INVALID") {
      console.warn("Token inválido.");
      return false;
    }

    if (response.authError === "TOKEN_MISSING") {
      console.warn("Token no proporcionado.");
      return false;
    }

    console.warn("Error de autenticación no manejado:", response);
    return false;
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return false;
  }
};


const refreshToken = async () => {
  const response = await obtenerDatos("auth/refresh");
  if (!response.success) console.error("Error al renovar token:", error);
  return response.success;
};