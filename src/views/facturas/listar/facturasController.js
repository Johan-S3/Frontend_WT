import { confirmAlert } from "../../../helpers/alertas.js";
import getCookie from "../../../helpers/getCookie.js";

import { obtenerDatos } from "../../../helpers/peticiones.js";

export const facturasController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */
    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    // Llamo la funcion donde se carga los registros de la entidad en el contenedor correspondiente.
    cargarFacturas(bodyTable);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los registros en el elemento correspondiente
async function cargarFacturas(contendor) {
    try {
        // Obtengo los contenedores a los que les agregaré informacion
        const contenedorInfo = document.querySelector(".content__head");
        const info = document.querySelector(".content__info");
        const tabla = document.querySelector(".table");

        // Realizo la consulta de los datos que se almacenaran en la tabla
        const facturas = await obtenerDatos("facturas/info/");
        console.log(facturas);


        // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no registros en la base de datos muestro mensaje (Nor found).
        if (facturas.code == 404) {
            tabla.setAttribute("style", "display: none")
            info.classList.remove("content__info--invisible");
            return;
        } else {
            info.classList.add("content__info--invisible");
        }

        let total = 0;

        // Recorro los tipos de lavados obtenidos
        facturas.data.forEach(async (factura) => {

            // Creo nuevos elementos: Una fila y todas su celdas o campos.
            const fila = document.createElement('tr');
            const celdaId = document.createElement("td");
            const celdaPlaca = document.createElement("td");
            const celdaFecha = document.createElement("td");
            const celdaTipoLavado = document.createElement("td");
            const celdaTotal = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // Le agrego una clase a la fila.
            fila.classList.add("table__row");

            // Le agrego a la fila el atributo que contiene el id de la tupla.
            fila.setAttribute("data-id", factura.factura_id)

            // Declaro y asigno a una variable un arreglo con las celdas de la fila
            const celdas = [celdaId, celdaPlaca, celdaFecha, celdaTipoLavado, celdaTotal, celdaAcciones];

            // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
            celdas.forEach(celda => {
                celda.classList.add("table__cell");
            })

            // Agrego clase diferente a la celda de acciones.
            celdaAcciones.classList.add("table__cell--separate");

            // Agrego a las celdas el contenido correspondiente.
            celdaId.textContent = factura.factura_id;
            celdaPlaca.textContent = factura.placa;
            celdaFecha.textContent = factura.fecha_factura;
            celdaTipoLavado.textContent = factura.tipo_lavado;
            celdaTotal.textContent = "$ " + factura.total_factura;

            total += factura.total_factura;


            const permisos = getCookie("permisos", []);

            permisos.forEach(permiso => {
                if (permiso == "detalle_factura.index") {
                    // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
                    const botonVer = document.createElement("button");
                    botonVer.classList.add("table__button");
                    botonVer.setAttribute("data-id", factura.factura_id)
                    const iconoVer = document.createElement("i");
                    iconoVer.classList.add("ri-eye-fill");
                    botonVer.append(iconoVer);

                    // Agrego eventos a los botones
                    botonVer.addEventListener("click", async () => {
                        const alerta = await confirmAlert("¿Desea ver la información de la factura?");

                        // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
                        if (alerta.isConfirmed) {
                            const idVer = botonVer.getAttribute("data-id");
                            window.location.href = `#/facturas/ver/id=${idVer}`;
                        }
                    })
                    // Agrego los botones a la celda de acciones.
                    celdaAcciones.append(botonVer);
                }
            });
            // Agrego las celdas a la fila
            if (celdaAcciones.children.length > 0) fila.append(celdaId, celdaPlaca, celdaFecha, celdaTipoLavado, celdaTotal, celdaAcciones);
            else {
                const accionesHead = document.querySelector("#acciones");
                if (accionesHead) accionesHead.remove();
                fila.append(celdaId, celdaPlaca, celdaFecha, celdaTipoLavado, celdaTotal,);
            }


            // Por ultimo agrego la fila al contenedor
            contendor.append(fila);
        })
        const totalContent = document.createElement("h2");
        totalContent.textContent = `TOTAL: $ ${total}`
        contenedorInfo.append(totalContent)
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}