import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas.js";
import getCookie from "../../../helpers/getCookie.js";

import { desactivarDato, eliminarDato, obtenerDatos } from "../../../helpers/peticiones.js";

export const tiposVehiculosController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */
  // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
  const bodyTable = document.querySelector(".table__body");

  const contenedorInfo = document.querySelector(".content__head");

  cargarBoton(contenedorInfo);


  // Llamo la funcion donde se carga los tipos de vehiculos en el contenedor correspondiente.
  cargarTiposVehiculos(bodyTable);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de vehiculos en el elemento correspondiente
async function cargarTiposVehiculos(contendor) {
  try {
    // Obtengo los contenedores a los que les agregaré informacion
    const info = document.querySelector(".content__info");
    const tabla = document.querySelector(".table");

    // Realizo la consulta de los datos que se almacenaran en la tabla
    const tiposVehiculos = await obtenerDatos("tiposVehiculos");
    
    // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no registros en la base de datos muestro mensaje (Nor found).
    if (tiposVehiculos.code == 404) {
      tabla.setAttribute("style", "display: none")
      info.classList.remove("content__info--invisible");
      return;
    } else {
      info.classList.add("content__info--invisible");
    }

    // Recorro los tipos de lavados obtenidos
    tiposVehiculos.data.forEach(async (tipoVehiculo) => {

      // Creo nuevos elementos: Una fila y todas su celdas o campos.
      const fila = document.createElement('tr');
      const celdaId = document.createElement("td");
      const celdaNombre = document.createElement("td");
      const celdaAcciones = document.createElement("td");

      // Le agrego una clase a la fila.
      fila.classList.add("table__row");

      // Le agrego a la fila el atributo que contiene el id de la tupla.
      fila.setAttribute("data-id", tipoVehiculo.id)

      // Declaro y asigno a una variable un arreglo con las celdas de la fila
      const celdas = [celdaId, celdaNombre, celdaAcciones];

      // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
      celdas.forEach(celda => {
        celda.classList.add("table__cell");
      })

      // Agrego clase diferente a la celda de acciones.
      celdaAcciones.classList.add("table__cell--separate");

      // Agrego a las celdas el contenido correspondiente.
      celdaId.textContent = tipoVehiculo.id;
      celdaNombre.textContent = tipoVehiculo.nombre_tipo;

      const permisos = getCookie("permisos", []);

      permisos.forEach(permiso => {
        if (permiso == "tipos_vehiculos.update") {
          // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
          const botonEditar = document.createElement("button");
          botonEditar.classList.add("table__button");
          botonEditar.setAttribute("data-id", tipoVehiculo.id)
          const iconoEditar = document.createElement("i");
          iconoEditar.classList.add("ri-edit-2-line");
          botonEditar.append(iconoEditar);

          // Agrego eventos a los botones
          botonEditar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Desea actualizar el tipo de vehiculo?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if (alerta.isConfirmed) {
              const idEditar = botonEditar.getAttribute("data-id");
              window.location.href = `#/tiposVehiculos/editar/id=${idEditar}`;
            }
          })
          // Agrego los botones a la celda de acciones.
          celdaAcciones.append(botonEditar);
        }
        if (permiso == "tipos_vehiculos.delete") {
          // Creo el boton de eliminar con sus clases y atributos y sus nodos hijos y los agrego.
          const botonEliminar = document.createElement("button");
          botonEliminar.classList.add("table__button", "table__button--delete");
          botonEliminar.setAttribute("data-id", tipoVehiculo.id)
          const iconoEliminar = document.createElement("i");
          iconoEliminar.classList.add("ri-delete-bin-2-fill");
          botonEliminar.append(iconoEliminar);

          // Le agrego al boton eliminar el evento click en el cual se valida si se quiere eliminar el usuario
          botonEliminar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Está seguro de eliminar el tipo de vehiculo?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if (alerta.isConfirmed) {
              const idEliminar = botonEliminar.getAttribute("data-id");
              // Y se llama a la función que elimina el usuario enviando como argumento el id a eliminar.
              eliminarTipoVehiculo(idEliminar);
            }

          })

          // Agrego los botones a la celda de acciones.
          celdaAcciones.append(botonEliminar);
        }
      });
      // Agrego las celdas a la fila
      fila.append(celdaId, celdaNombre, celdaAcciones);

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
    if (permiso == "tipos_vehiculos.create") {
      const botonCreate = document.createElement("button");
      botonCreate.classList.add("content__button");
      botonCreate.textContent = "Agregar tipo vehiculo"

      botonCreate.addEventListener("click", cargarVistaCrear);

      contendor.append(botonCreate);
      return;
    }
  });
}

// Funcion para borrar de la base de datos el id y para (desactivar) la tupla en la tabla.
async function eliminarTipoVehiculo(id) {
  // Se realiza la peticion para eliminar el tipo de vehiculo por el id.
  const peticion = await eliminarDato("tiposVehiculos", id);
  // Si el codigo de la respuesta el 200. Es decir, el tipo de vehiculo ya se eliminó de la base de datos...
  if (peticion.code == 200) {

    // Obtengo la fila con el id del registro que se eliminó y la remuevo de la tabla.
    const fila = document.querySelector(`[data-id = "${id}"]`)
    fila.remove();

    // Por ultimo muestro una alerta de exito indicando que el tipo de vehiculo se eliminó.
    await successAlert("Tipo de vehiculo eliminado correctamente");
    // location.reload();
  } else {
    errorAlert(`¡Ups! ${peticion.message}`, peticion.errors);
  }
}

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarVistaCrear() {
  window.location.href = "#/tiposVehiculos/crear";
}