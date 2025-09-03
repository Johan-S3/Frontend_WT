import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas.js";
import getCookie from "../../../helpers/getCookie.js";

import { eliminarDato, obtenerDatos } from "../../../helpers/peticiones.js";

export const verItemsTiposLavadosController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */
    const { id } = parametros;

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    const contenedorInfo = document.querySelector(".content__head");

    try {

        // Realizo la consulta de los datos que se almacenaran en la tabla
        const itemsTiposLavados = await obtenerDatos(`itemsTiposLavados/tipoLav/${id}`);
        console.log(itemsTiposLavados);

        if (itemsTiposLavados.code == 404) return

        let total = 0;

        // Recorro los tipos de lavados obtenidos
        itemsTiposLavados.data.forEach(async (itemTipoLavado) => {

            // Creo nuevos elementos: Una fila y todas su celdas o campos.
            const fila = document.createElement('tr');
            const celdaId = document.createElement("td");
            const celdaNombre = document.createElement("td");
            const celdaDescripcion = document.createElement("td");
            const celdaValor = document.createElement("td");

            // Le agrego una clase a la fila.
            fila.classList.add("table__row");

            // Declaro y asigno a una variable un arreglo con las celdas de la fila
            const celdas = [celdaId, celdaNombre, celdaDescripcion, celdaValor];

            // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
            celdas.forEach(celda => {
                celda.classList.add("table__cell");
            })

            // Agrego a las celdas el contenido correspondiente.
            celdaId.textContent = itemTipoLavado.id
            celdaNombre.textContent = itemTipoLavado.nombre;
            celdaDescripcion.textContent = itemTipoLavado.descripcion;
            celdaValor.textContent = itemTipoLavado.valor;

            total += itemTipoLavado.valor;

            fila.append(celdaId, celdaNombre, celdaDescripcion, celdaValor);

            // Por ultimo agrego la fila al contenedor
            bodyTable.append(fila);

        })

        const totalContent = document.createElement("h2");
        totalContent.textContent = `TOTAL: $ ${total}`
        contenedorInfo.append(totalContent)
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}