
/* ------------------ IMPORTACIONES ------------------  */
// Realizo todas las importaciones correspondientes de las funciones necesarias.
import { errorAlert, successAlert } from "../../../helpers/alertas.js";
import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module.js";
import { crearDato, obtenerDatos } from "../../../helpers/peticiones.js";


export const crearItemTipoLavadoController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");

    // Obtengo la referencia de las entradas de texto y de seleccion del formulario por su name
    const selectTipoLav = formRegistro.querySelector('select[name="tipoLavado"]');
    const selectItems = formRegistro.querySelector('select[name="items"]');

    await cargarTiposLavados();

    selectTipoLav.addEventListener("change", () => {
        const selectedOption = selectTipoLav.options[selectTipoLav.selectedIndex];
        const idTipoVeh = selectedOption.getAttribute("data-tipo-vehiculo");
        // console.log(idTipoVeh);

        cargarItemsLavados(idTipoVeh);
    });

    /* ------------------ EVENTOS ------------------  */
    // Declaro y defino un arreglo con los campos del formulario.
    const campos = [selectTipoLav];

    // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
    campos.forEach(campo => {
        campo.addEventListener("blur", outFocus);
    });

    // Al formualrio le agrego el evento submit
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        const itemsSeleccionados = Array.from(selectItems.selectedOptions).map(option => option.value);

        let error = null;
        itemsSeleccionados.forEach(async item => {
            // Creo un objeto con los valores agregados en el formualrio.
            const itemTipoLavado = {
                id_tipo_lavado: selectTipoLav.value,
                id_item_lavado: item
            }
            // console.log(itemTipoLavado);

            // Try..catch para poder ver el error.
            try {
                // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
                const respuesta = await crearDato("itemsTiposLavados", itemTipoLavado);
                //   console.log(respuesta);

                // Si la petición NO se realizó con exito...
                if (!respuesta.success) {
                    if (Array.isArray(respuesta.erros) && respuesta.erros.length) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
                    else error = respuesta.erros //Si no es un arreglo solo alamceno el error obtenido en la varaible.
                }


            } catch (error) {
                // Imprimo en la consola el error obtenido
                console.error(error);
                return;
            }
        });

        if (error == null) {
            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert("Items asignados correctamente");
            // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a una vista
                // formRegistro.reset();
                window.location.href = '#/itemsTiposLavados';
            }
        } else {
            // Por ultimo muestro el error en una alerta y retorno para no seguir.
            await errorAlert("Ups, Ocurrio un error", error);
            return;
        }
    })

    /* ------------------ FUNCIONES ------------------  */

    // Funcion para cargar los tipos de lavados en el la etiqueta option correspondiente
    async function cargarTiposLavados() {
        // Asigno en una variable la respues de la peticion de los tipos de lavados
        const tiposLavExistentes = await obtenerDatos("tiposLavados/free");
        console.log(tiposLavExistentes);

        if (tiposLavExistentes.code == 404) {
            await errorAlert("!Ups¡ No se puede crear", "Primero debe agregar tipos de lavados")
            window.location.href = "#/tiposLavados";
            return;
        }

        // Recorro los tipos de lavados obtenido
        tiposLavExistentes.data.forEach(tipoLavado => {
            // Creo un nuevo elemento option le doy el value que es el id del tipoLavado y le agrego contenido que es el nombre del tipoLavado
            const option = document.createElement('option');
            option.setAttribute("value", tipoLavado.id);
            option.textContent = tipoLavado.nombre;
            option.setAttribute("data-tipo-vehiculo", tipoLavado.id_tipo_vehiculo)

            // Por ultimo agrego el rol al option correspondiente. 
            selectTipoLav.append(option);
        });
    }

    // Funcion para cargar los items de lavados en el la etiqueta option correspondiente
    async function cargarItemsLavados(idTipoVeh) {
        selectItems.innerHTML = "";
        // Asigno en una variable la respues de la peticion de los items de lavados
        const itemsLavExistentes = await obtenerDatos(`itemsLavados/tipoVeh/${idTipoVeh}`);
        console.log(itemsLavExistentes);

        if (itemsLavExistentes.code == 404) {
            await errorAlert("!Ups¡ No se puede crear", "Primero debe agregar items de lavados")
            window.location.href = "#/itemsLavados";
        }

        // Recorro los items de lavados obtenido
        itemsLavExistentes.data.forEach(itemLavado => {
            // Creo un nuevo elemento option le doy el value que es el id del itemLavado y le agrego contenido que es el nombre del itemLavado
            const option = document.createElement('option');
            option.setAttribute("value", itemLavado.id);
            option.textContent = itemLavado.nombre;

            // Por ultimo agrego el rol al option correspondiente. 
            selectItems.append(option);
        });
    }
}
