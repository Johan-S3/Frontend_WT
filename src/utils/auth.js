import { obtenerDatos } from "../helpers/peticiones";

export const isAuth = async () => {
  try {
    let response = await obtenerDatos("auth/protected");

    console.log(response);
    
    // Verifica si fue exitoso
    if (response.success) return true;

    const refresh = await refreshToken();
    if (!refresh) return false;
    console.log(refresh);

    return true;
    
    // console.warn("Error de autenticación no manejado:", response);
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return false;
  }
};


const refreshToken = async () => {
  const response = await obtenerDatos("auth/refresh");

  console.log(response);
  
  if (!response.success){
    console.error("Error al renovar token:", error);
    return false
  }
  
  alert("Token renovado");
  return true;
};