import { obtenerDatos } from "../../../helpers/peticiones.js";

export const verFacturaController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */
    const { id } = parametros;

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    const contenedorInfo = document.querySelector(".content__head");

    try {
        const factura = await obtenerDatos(`facturas/${id}`)

        let totalFactura = factura.data.total;

        // Realizo la consulta de los datos que se almacenaran en la tabla
        const detallesFactura = await obtenerDatos(`facturas/items/${id}`);
        console.log(detallesFactura);

        if (detallesFactura.code == 404) return

        let total = 0;

        // Recorro los tipos de lavados obtenidos
        detallesFactura.data.forEach(async (detalle) => {

            // Creo nuevos elementos: Una fila y todas su celdas o campos.
            const fila = document.createElement('tr');
            const celdaTipoLavado = document.createElement("td");
            const celdaItem = document.createElement("td");
            const celdaValor = document.createElement("td");

            // Le agrego una clase a la fila.
            fila.classList.add("table__row");

            // Declaro y asigno a una variable un arreglo con las celdas de la fila
            const celdas = [celdaTipoLavado, celdaItem, celdaValor];

            // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
            celdas.forEach(celda => {
                celda.classList.add("table__cell");
            })

            // Agrego a las celdas el contenido correspondiente.
            celdaTipoLavado.textContent = detalle.tipo_lavado;
            celdaItem.textContent = detalle.item_nombre;
            celdaValor.textContent = detalle.item_valor;

            total += detalle.item_valor;

            fila.append(celdaTipoLavado, celdaItem, celdaValor);

            // Por ultimo agrego la fila al contenedor
            bodyTable.append(fila);

        })

        const subtotalContent = document.createElement("h2");
        const descuentoContent = document.createElement("h2");
        const totalContent = document.createElement("h2");
        subtotalContent.textContent = `Subtotal: $ ${total}`;
        descuentoContent.textContent = `Descuento: ${parseInt(total) - parseInt(totalFactura)}`
        totalContent.textContent = `TOTAL: $ ${parseInt(totalFactura)}`
        contenedorInfo.append(subtotalContent, descuentoContent, totalContent)
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}