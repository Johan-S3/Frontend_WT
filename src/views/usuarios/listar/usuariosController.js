import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas.js";
import getCookie from "../../../helpers/getCookie.js";

import { eliminarDato, obtenerDatos } from "../../../helpers/peticiones.js";

export const usuariosController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */
  // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
  const bodyTable = document.querySelector(".table__body");

  const contenedorInfo = document.querySelector(".content__head");

  // Obtengo el boton para crear un nuevo tipo de lavado
  // const buttonCreate = document.querySelector(".content__button");

  cargarBoton(contenedorInfo);


  // Llamo la funcion donde se carga los usuarios en el contenedor correspondiente.
  cargarUsuarios(bodyTable);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarUsuarios(contendor) {
  try {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    console.log(usuario);

    let usuarios = [];

    switch (usuario.id_rol) {
      case 1:
        // Asigno en una variable la respuesta de la peticion de los usuarios
        usuarios = await obtenerDatos("usuarios");
        break;
      case 2:
        // Asigno en una variable la respuesta de la peticion de los usuarios
        usuarios = await obtenerDatos("usuarios/gerentes");
        break;
      case 3:
        // Asigno en una variable la respuesta de la peticion de los usuarios
        usuarios = await obtenerDatos("usuarios/lavadores");
        break;
      default:
        break;
    }


    // console.log(usuarios); return

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
      const celdaAcciones = document.createElement("td");

      // Le agrego una clase a la fila.
      fila.classList.add("table__row");

      // Le agrego a la fila el atributo que contiene el id de la tupla.
      fila.setAttribute("data-id", usuario.id)

      // Declaro y asigno a una variable un arreglo con las celdas de la fila
      const celdas = [celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaRol, celdaAcciones];

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
      celdaRol.textContent = usuario.nombre_rol;

      const permisos = getCookie("permisos", []);

      permisos.forEach(permiso => {
        if (permiso == "usuarios.update") {
          // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
          const botonEditar = document.createElement("button");
          botonEditar.classList.add("table__button");
          botonEditar.setAttribute("data-id", usuario.id)
          const iconoEditar = document.createElement("i");
          iconoEditar.classList.add("ri-edit-2-line");
          botonEditar.append(iconoEditar);

          // Agrego eventos a los botones
          botonEditar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Desea actualizar el usuario?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if (alerta.isConfirmed) {
              const idEditar = botonEditar.getAttribute("data-id");
              window.location.href = `#/usuarios/editar/id=${idEditar}`;
            }
          })
          // Agrego los botones a la celda de acciones.
          celdaAcciones.append(botonEditar);
        }
        if (permiso == "usuarios.delete") {
          // Creo el boton de eliminar con sus clases y atributos y sus nodos hijos y los agrego.
          const botonEliminar = document.createElement("button");
          botonEliminar.classList.add("table__button", "table__button--delete");
          botonEliminar.setAttribute("data-id", usuario.id)
          const iconoEliminar = document.createElement("i");
          iconoEliminar.classList.add("ri-delete-bin-2-fill");
          botonEliminar.append(iconoEliminar);

          // Le agrego al boton eliminar el evento click en el cual se valida si se quiere eliminar el usuario
          botonEliminar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Está seguro de eliminar el usuario?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if (alerta.isConfirmed) {
              const idEliminar = botonEliminar.getAttribute("data-id");
              // Y se llama a la función que elimina el usuario enviando como argumento el id a eliminar.
              eliminarusuario(idEliminar);
            }

          })

          // Agrego los botones a la celda de acciones.
          celdaAcciones.append(botonEliminar);
        }
      });
      // Agrego las celdas a la fila
      fila.append(celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaRol, celdaAcciones);

      // Por ultimo agrego la fila al contenedor
      contendor.append(fila);
    })
  } catch (error) {
    // Muestro el error en la consola.
    console.log(error);
  }
}

async function cargarBoton(contendor) {
  const permisos = getCookie("permisos", []);

  if (!permisos.length) return;

  permisos.forEach(permiso => {
    if (permiso == "usuarios.create") {
      const botonCreate = document.createElement("button");
      botonCreate.classList.add("content__button");
      botonCreate.textContent = "Agregar Usuario"

      botonCreate.addEventListener("click", cargarVistaCrear);

      contendor.append(botonCreate);
      return;
    }
  });
}

// Funcion para borrar de la base de datos el id y para eliminar la tupla en la tabla.
async function eliminarusuario(id) {
  // Se realiza la peticion para eliminar el usuario por el id.
  const peticion = await eliminarDato("usuarios", id);
  // Si el codigo de la respuesta el 200. Es decir, el usuario ya se eliminó de la base de datos...
  if (peticion.code == 200) {
    // Obtengo la fila con el id del registro que se eliminó y la remuevo de la tabla.
    const fila = document.querySelector(`[data-id = "${id}"]`)
    fila.remove();
    // Por ultimo muestro una alerta de exito indicando que el usuario se eliminó.
    successAlert("usuario eliminado correctamente");
  } else {
    errorAlert(`¡Ups! ${peticion.message}`, peticion.errors);
  }
}

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarVistaCrear() {
  window.location.href = "#/usuarios/crear";
}