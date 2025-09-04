import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas.js";
import getCookie from "../../../helpers/getCookie.js";

import { desactivarDato, eliminarDato, obtenerDatos } from "../../../helpers/peticiones.js";

export const lavadoresController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */
  // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
  const bodyTable = document.querySelector(".table__body");

  // Llamo la funcion donde se carga los lavadores en el contenedor correspondiente.
  cargarLavadores(bodyTable);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarLavadores(contendor) {
  try {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    console.log(usuario);

    const usuarios = await obtenerDatos("usuarios/lavadores");


    console.log(usuarios);   

    const info = document.querySelector(".content__info");
    const tabla = document.querySelector(".table");
    // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay usuarios creados se redirige a la pagina donde se agregan nuevos usuarios a a base de datos.
    if (usuarios.code == 404) {
      tabla.setAttribute("style", "display: none")
      info.classList.remove("content__info--invisible");
      return;
    } else {
      info.classList.add("content__info--invisible");
    }

    // Recorro los usuarios obtenidos
    usuarios.data.forEach(async (usuario) => {

      // Creo nuevos elementos: Una fila y todas su celdas o campos.
      const fila = document.createElement('tr');
      const celdaId = document.createElement("td");
      const celdaCedula = document.createElement("td");
      const celdaNombre = document.createElement("td");
      const celdaCorreo = document.createElement("td");
      const celdaTelefono = document.createElement("td");
      const celdaRol = document.createElement("td");
      const celdaEstado = document.createElement("td");
      const celdaAcciones = document.createElement("td");

      // Le agrego una clase a la fila.
      fila.classList.add("table__row");

      // Le agrego a la fila el atributo que contiene el id de la tupla.
      fila.setAttribute("data-id", usuario.id)

      // Declaro y asigno a una variable un arreglo con las celdas de la fila
      const celdas = [celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaRol, celdaEstado, celdaAcciones];

      // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
      celdas.forEach(celda => {
        celda.classList.add("table__cell");
      })

      // Agrego clase diferente a la celda de acciones.
      celdaAcciones.classList.add("table__cell--separate");

      // Agrego a las celdas el contenido correspondiente.
      celdaId.textContent = usuario.id;
      celdaCedula.textContent = usuario.cedula;
      celdaNombre.textContent = usuario.nombre;
      celdaCorreo.textContent = usuario.correo;
      celdaTelefono.textContent = usuario.telefono;
      celdaEstado.textContent = usuario.nombre_estado;
      celdaRol.textContent = usuario.nombre_rol;

      // Agrego las celdas a la fila
      fila.append(celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaRol, celdaEstado);
      // Por ultimo agrego la fila al contenedor
      contendor.append(fila);
    })
  } catch (error) {
    // Muestro el error en la consola.
    console.log(error);
  }
}