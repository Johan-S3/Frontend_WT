import { errorAlert, successAlert } from "../../../helpers/alertas";
import { validarFormulario } from "../../../helpers/module";
import { crearDato, desactivarDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

export const asignarLavadoController = async (parametros = null) => {
    const { id } = parametros;

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");

    // Obtengo los elementos del vehiculo en el formulario. 
    const placa = document.querySelector('input[name="placa"]');
    const tipoLavado = document.querySelector('select[name="type"]');
    const lavador = document.querySelector('select[name="lavador"]')

    // Obtengo la informaicon del lavado.
    const lavado = await obtenerDatos(`lavados/pendientes/${id}`)

    console.log(lavado);

    placa.value = lavado.data.placa

    // Cargo los tipos de lavados y lavadores en sus select correspondientes.
    cargarTipoLavados(tipoLavado, lavado.data.id_tipo_vehiculo);
    cargarLavadores(lavador);

    // Al formualrio le agrego el evento submit
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // Creo un objeto lavado con los valores agregados en el formulario.
        let lavadoActualizar = {
            id_vehiculo: lavado.data.id_vehiculo,
            id_tipo_lavado: tipoLavado.value,
            id_conductor: lavado.data.id_conductor,
            id_lavador: lavador.value,
            id_estado: 2
        }

        // console.log(lavadoActualizar); 


        // Try..catch para poder ver el error.
        try {

            const estadoLavadorActualizado = await desactivarDato("usuarios/activo", lavadoActualizar.id_lavador);

            if (estadoLavadorActualizado.code != 200) return;

            // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el lavado.
            const lavadoActualizado = await editarDato(`lavados`, id, lavadoActualizar);
            console.log(lavadoActualizado);

            // Si el codigo de la peticion no es 200. Es decir no se actualizó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
            // Y retorno para no seguir ejecutando el codigo.
            if (lavadoActualizado.code != 200) {
                mostrarErrores(lavadoActualizado);
                return;
            }

            // Si todas las peticiones se realizaron con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(lavadoActualizado.message);
            // Si la alerta es confirmado. Es decir, se di "Ok" en ella
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a la vista de inicio
                formRegistro.reset();
                window.location.href = '#/lavados';
            }
        } catch (error) {
            // Imprimo en la consola el error obtenido
            console.error(error);
        }
    })
}

/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarTipoLavados(contendor, idTipoVehiculo) {
    try {
        // console.log(idTipoVehiculo); return

        // Asigno en una variable la respuesta de la peticion de los tipos de lavados
        const tiposLavados = await obtenerDatos(`tiposLavados/tipoVeh/${idTipoVehiculo}`);
        // console.log(tiposLavados);

        // Recorro los tipos de lavados obtenidos
        tiposLavados.data.forEach(tipoLavado => {
            // Creo un nuevo elemento option y le agrego el atributo value con el id del tipo de lavado y contenido que es el nombre del tipo de lavado
            const option = document.createElement('option');
            option.setAttribute("value", tipoLavado.id)
            option.textContent = tipoLavado.nombre;

            // Por ultimo agrego el option al contendor de los tipos de lavados. 
            contendor.append(option);
        })
    } catch (error) {
        console.log(error);
    }
}

// Funcion para cargar los lavadores en el elemento correspondiente
async function cargarLavadores(contendor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los lavadores
        const lavadores = await obtenerDatos("usuarios/lavadores/free");
        // console.log(lavadores);

        if(lavadores.code == 404){
            await errorAlert("No se puede asignar un lavado", "Primero debe esperar a que se libere o se cree otro lavador")
            window.location.href = "#/lavados";
            return
        }

        // Recorro los lavadores obtenidos
        lavadores.data.forEach(lavador => {
            // Creo un nuevo elemento option y le agrego el atributo value con el id del lavador y contenido que es el nombre del lavador
            const option = document.createElement('option');
            option.setAttribute("value", lavador.id)
            option.textContent = lavador.nombre;

            // Por ultimo agrego el option al contendor de los lavadores. 
            contendor.append(option);
        })
    } catch (error) {
        console.log(error);
    }
}

// Funcion que me muestras los errores de una peticion recibiendo la peticion como parametro.
async function mostrarErrores(respuesta) {
    let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
    if (Array.isArray(respuesta.erros) && respuesta.erros.length) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
    else error = respuesta.erros //Si no es un arreglo solo alamceno el error obtenido en la varaible.
    // Por ultimo muestro el error en una alerta y retorno para no seguir.
    await errorAlert(respuesta.message, error);
}