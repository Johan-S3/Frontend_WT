
import { errorAlert, successAlert } from "../../../helpers/alertas";
import { limitar, outFocus, validarFormulario, validarNumeros } from "../../../helpers/module";
import { crearDato, desactivarDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

export const pagarLavadoController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    const { id } = parametros;

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");

    // Obtengo la referencia de las entradas de texto del formulario por su name
    const placa = formRegistro.querySelector('input[name="placa"]');
    const valorLav = formRegistro.querySelector('input[name="valor"]');
    const descuento = formRegistro.querySelector('input[name="descuento"]');
    const total = formRegistro.querySelector('input[name="total"]');
    const recibido = formRegistro.querySelector('input[name="recibido"]');
    const cambio = formRegistro.querySelector('input[name="cambio"]');

    // Declaro e inicilizo un objeto vacio para agregar los valoores necesarios para calcular y luego crear la factura.

    // Obtengo los datos del lavado.
    const lavado = await obtenerDatos(`lavados/${id}`);
    // console.log(lavado); 

    // Obtengo el vehiculo con su descuento.
    const vehiculoDesc = await obtenerDatos(`vehiculos/descuento/${lavado.data.id_vehiculo}`);
    // console.log(vehiculoDesc);

    // Obtngo el valor del tipo de lavado.
    const valorTipoLavado = await obtenerDatos(`tiposLavados/valor/${lavado.data.id_tipo_lavado}`);
    // console.log(valorTipoLavado);

    // Se calcula el valor del decuento
    const porcDesc = vehiculoDesc.data.porcentaje_descuento;
    const valorLavado = valorTipoLavado.data.valor;
    const valorDescuento = valorLavado * (porcDesc / 100);

    // Le asigno a las entradas de texto el valor corresppondiente.
    placa.value = vehiculoDesc.data.placa;
    valorLav.value = valorTipoLavado.data.valor;
    descuento.value = valorDescuento;
    total.value = valorLavado - valorDescuento;

    /* ------------------ EVENTOS ------------------  */
    // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
    recibido.addEventListener('keydown', validarNumeros);

    // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
    recibido.addEventListener("keypress", (e) => limitar(e, 7));

    // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
    recibido.addEventListener("blur", outFocus);

    // Agrego evento a la entrada de texto recibido la cual a medida que escribe realiza un calculo y realiza una accion.
    recibido.addEventListener("input", () => {
        let cambioDinero = parseInt(recibido.value) - parseInt(total.value);
        if (cambioDinero > 0) cambio.value = cambioDinero;
        else cambio.value = "";
    });

    // Al formualrio le agrego el evento submit
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // Creo un objeto con los valores quye se guardaran en la base de datos.
        const factura = {
            id_lavado: id,
            total: parseInt(total.value)
        }

        const lavadoActualizar = {
            id_vehiculo: lavado.data.id_vehiculo,
            id_tipo_lavado: lavado.data.id_tipo_lavado,
            id_conductor: lavado.data.id_conductor,
            id_lavador: lavado.data.id_lavador,
            id_estado: 3
        }

        // console.log(factura);
        // console.log(lavadoActualizar);

        // Si el total de la factura es mayor al valor ingresado en el dinero recibido muestra mensaje de error y retorna para no seguir ejecutando el codigo.
        if (factura.total > parseInt(recibido.value)) {
            await errorAlert("Ups, !verifica el dinero que recibiste¡", "El valor recibido no puede ser menor al total de la factura");
            return;
        }

        // Try..catch para poder ver el error.
        try {
            // En una variable almaceno la respuesta de hacer fetch a la ruta que crear el tipo de lavado.
            const respuesta = await crearDato("facturas", factura);
            console.log(respuesta);

            // Si la petición NO se realizó con exito...
            if (respuesta.code != 201) {
                mostrarErrores(respuesta);
                return;
            }

            // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el lavado.
            const lavadoActualizado = await editarDato(`lavados`, id, lavadoActualizar);
            // console.log(lavadoActualizado);

            await desactivarDato("usuarios/activarUser", lavadoActualizar.id_lavador);

            // Si la petición NO se realizó con exito...
            if (lavadoActualizado.code != 200) {
                mostrarErrores(lavadoActualizado);
                return;
            }

            const itemsFacturas = await obtenerDatos(`facturas/items/${respuesta.data.id}`);
            console.log(itemsFacturas);

            itemsFacturas.data.forEach(async itemFactura => {
                let detalleFactura = {
                    id_factura: itemFactura.factura_id,
                    id_item_lavado: itemFactura.item_id,
                    nombre_item: itemFactura.item_nombre,
                    precio_item: itemFactura.item_valor
                }

                const detalleFacturaCreada = await crearDato("detalleFactura", detalleFactura)
                console.log(detalleFacturaCreada);
                
            });
            

            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(respuesta.message);
            // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
            // await generarFactura(respuesta.data);
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a la vista de tipos de lavados
                formRegistro.reset();
                window.location.href = '#/lavados';
            }
        } catch (error) {
            // Imprimo en la consola el error obtenido
            console.error(error);
        }
    })
}

// Funcion que me muestras los errores de una peticion recibiendo la peticion como parametro.
async function mostrarErrores(respuesta) {
    let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
    if (Array.isArray(respuesta.erros) && respuesta.erros.length) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
    else error = respuesta.erros //Si no es un arreglo solo alamceno el error obtenido en la varaible.
    // Por ultimo muestro el error en una alerta y retorno para no seguir.
    await errorAlert(respuesta.message, error);
}
