import Swal from "sweetalert2";
import { confirmAlert, errorAlert, infoAlert, infoAlertHTML, successAlert } from "../../../helpers/alertas";
import { desactivarDato, editarDato, eliminarDato, obtenerDatos } from "../../../helpers/peticiones";

export const lavadosController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    const pendientesContent = document.getElementById("contenedor-pendientes");
    const enProcesoContent = document.getElementById("contenedor-lavados");

    // Obtengo la referencia de los elementos botones donde me redirige al apartado donde se registra un vehiculo.
    const agregarLavado = document.getElementById("add-vehicle");

    cargarLavadosPendientes(pendientesContent);
    cargarLavadosEnProceso(enProcesoContent);

    agregarLavado.addEventListener("click", async () => {
        if (!await existenTiposLavados()) {
            await errorAlert("No puede crear un lavado", "Primero debes agregar tipos de lavados")
            return
        }
        if (!await existenLavadores()) {
            await errorAlert("No puede crear un lavado", "Primero debes agregar lavadores")
            return
        }
        await buscarVehiculo();
    });
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para verificar si hay tipos de lavados
async function existenTiposLavados() {
    try {
        // Asigno en una variable la respuesta de la peticion de los tipos de lavados
        const tiposLavados = await obtenerDatos("tiposLavados/items");
        // console.log(tiposLavados);

        // Si el codigo obtenido de la petición es 200 (Recursos encontrados). Es decir, hay tipos de lavados creados se retorna true. Si no cumple con la condicion re retorna false
        if (tiposLavados.code == 200) return true

        return false;
    } catch (error) {
        console.log(error);
    }
}

// Funcion para verificar si hay lavadores
async function existenLavadores() {
    try {
        try {
            // Asigno en una variable la respuesta de la peticion de los tipos de lavados
            const lavadores = await obtenerDatos("usuarios/lavadores");
            // console.log(lavadores);

            // Si el codigo obtenido de la petición es 200 (Recursos encontrados). Es decir, hay tipos de lavados creados se retorna true. Si no cumple con la condicion re retorna false
            if (lavadores.code == 200) return true

            return false;
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

// Funcion que solicita una placa en un Sweet alert y la busca en la base de datos.
async function buscarVehiculo() {
    // Le asigno a una variable el valor ingresado por medio de un Swall
    let placaBuscar = await Swal.fire({
        title: 'Ingrese la placa',
        input: 'text',
        inputLabel: 'Placa del vehiculo',
        inputPlaceholder: 'Ej. AAA00A',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return '¡Debes escribir algo!';
            }
        }
    });

    // Si el swal se confirmó...
    if (placaBuscar.isConfirmed) {
        window.location.href = `#/lavados/crear/placa=${placaBuscar.value}`;
        // // Asigno a una varaible la respuesta de la peticion de buscar  un vehiculo por la palca ingresada.
        // const vehiculo = await obtenerDatos(`vehiculos/placa/${placaBuscar.value}`);
        // // Si el codigo de la peticion es 200 es decir, obtenido con exito entonces redirige a la pagina donde se actualizará la informacion del vehiculo.
        // if (vehiculo.code == 200) window.location.href = `#/vehiculo/registrar/placa=${placaBuscar.value}`;
        // // Si el codigo de la peticion no es 200 entonces redirige a la pagina donde se crear un nuevo vehiculo.
        // else window.location.href = `#/vehiculo/crear/placa=${placaBuscar.value}`;
    }
}

// Funcion que carga los lavadoes que estan en estado de registrado
async function cargarLavadosPendientes(contenedor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los lavadoes
        const lavadosPendientes = await obtenerDatos(`lavados/pendientes`);
        // console.log(lavadosPendientes.data); return

        if (lavadosPendientes.code == 404) return

        // Recorro los lavados pendientes obtenidos
        for (const lavado of lavadosPendientes.data) {
            // Creo un nuevo elemento div le agrego sus clases y su atributo -> Card que contiene los detalles de cada lavado
            const card = document.createElement('div');
            card.classList.add("panel__card", "card");
            card.setAttribute("data-id", lavado.id)

            // Creo un nuevo elemento div y le agrego su clase -> Bloque que contiene el tipo de vehiculo y el boton para eliminar.
            const infoVeh = document.createElement('div');
            infoVeh.classList.add("card__information");
            const tipoL = document.createElement('small');
            tipoL.classList.add("card__vehicle");
            tipoL.textContent = lavado.nombre_tipo;

            const deleteLavado = document.createElement('i');
            deleteLavado.classList.add("ri-delete-bin-6-fill", "card__icon");
            deleteLavado.setAttribute("data-id", lavado.id);
            deleteLavado.addEventListener("click", async () => {
                const confirmacion = await confirmAlert("¿Está seguro de eliminar el lavado?");
                if (!confirmacion.isConfirmed) return;
                const eliminado = await eliminarDato("lavados", deleteLavado.getAttribute("data-id"));
                // Si la peticion se realizó con exito muestro una alerta informando.
                if (eliminado.code == 200) {
                    const cardEliminar = document.querySelector(`div[data-id="${deleteLavado.getAttribute("data-id")}"]`)
                    cardEliminar.remove();
                    await successAlert(eliminado.message);
                }
            })

            infoVeh.append(tipoL, deleteLavado);

            // Creo un nuevo elemento strong le agrego su clase -> Bloque que contiene la placa del vehiculo
            const placaIng = document.createElement('strong');
            placaIng.classList.add("card__plate");
            placaIng.textContent = lavado.placa;

            // Creo un nuevo elemento div le agrego sus clases y su atributo -> Bloque que contiene las acciones de los lavados
            const accionesIng = document.createElement('div');
            accionesIng.classList.add("card__space", "space");

            // Creo un nuevo elemento a que será el encargado de redirigir al formulario donde se edita
            const verLavado = document.createElement('a');
            verLavado.classList.add("space__icon");
            verLavado.setAttribute("data-id", lavado.id);
            const iconVer = document.createElement('i');
            iconVer.classList.add("ri-eye-fill");
            verLavado.append(iconVer);
            verLavado.addEventListener("click", async () => {
                const lavadoInformacion = await obtenerDatos(`lavados/pendientes/${verLavado.getAttribute("data-id")}`);

                if (lavadoInformacion.code == 200) {
                    // console.log(lavadoInformacion);
                    const { data } = lavadoInformacion;
                    infoAlertHTML("Información de lavado",
                        `<b>Placa:</b> ${data.placa}<br>
                        <b>Marca:</b> ${data.marca_vehiculo}<br>
                        <b>Modelo:</b> ${data.modelo_vehiculo}<br>
                        <b>Tipo:</b> ${data.nombre_tipo}<br>
                        <b>Clave:</b> ${data.clave}<br><br>
                        <b>Cedula conductor:</b> ${data.cedula}<br>
                        <b>Nombre:</b> ${data.nombre}<br>
                        <b>Telefono:</b> ${data.telefono}<br>
                        <b>Correo:</b> ${data.correo}`
                    )
                }
            });

            // Creo un nuevo elemento a que será el encargado de redirigir al formulario donde se asigna lavado
            const asignarLav = document.createElement('a');
            asignarLav.classList.add("space__icon", "space__icon--scale");
            asignarLav.setAttribute("href", `#/lavados/asignar/id=${lavado.id}`);
            const iconAsignar = document.createElement('i');
            iconAsignar.classList.add("ri-car-washing-fill");
            asignarLav.append(iconAsignar);

            accionesIng.append(verLavado, asignarLav);

            // Creo un nuevo elemento div le agrego su clase y su atributo -> Bloque que contiene la clave del vehiculo si tiene.
            const infoClave = document.createElement('div');
            infoClave.classList.add("card__washer");
            const lavadorVeh = document.createElement('small');
            if (lavado.clave == "" || lavado.clave == null) lavadorVeh.textContent = "Sin clave";
            else lavadorVeh.textContent = lavado.clave;
            const iconLavador = document.createElement('i');
            iconLavador.classList.add("ri-lock-2-fill", "card__icon");

            infoClave.append(lavadorVeh, iconLavador);

            // console.log(vehiculoIng);

            card.append(infoVeh, placaIng, accionesIng, infoClave);

            // Por ultimo agrego la card al contendor de los lavados. 
            contenedor.append(card);


        }
    } catch (error) {
        console.log(error);
    }
}

// Funcion que carga los lavados que estan en estado de En proceso. Es decir son vehiculos que se encuentran lavando.
async function cargarLavadosEnProceso(contenedor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los lavados en proceso
        const lavadosProceso = await obtenerDatos(`lavados/enProceso`);
        console.log(lavadosProceso); 

        if (lavadosProceso.code == 404) return;

        // Recorro los lavados obtenidos
        for (const lavado of lavadosProceso.data) {
            // Creo un nuevo elemento div le agrego sus clases y su atributo -> Card que contiene los detalles de cada lavado
            const card = document.createElement('div');
            card.classList.add("panel__card", "card");
            card.setAttribute("data-id", lavado.id)

            // Creo un nuevo elemento div y le agrego su clase -> Bloque que contiene el tipo de vehiculo y el boton para eliminar.
            const infoVeh = document.createElement('div');
            infoVeh.classList.add("card__information");
            const tipoL = document.createElement('small');
            tipoL.classList.add("card__vehicle");
            tipoL.textContent = lavado.nombre_tipo;

            const deleteLavado = document.createElement('i');
            deleteLavado.classList.add("ri-delete-bin-6-fill", "card__icon");
            deleteLavado.setAttribute("data-id", lavado.id);
            deleteLavado.addEventListener("click", async () => {
                const confirmacion = await confirmAlert("¿Está seguro de eliminar el lavado?");
                if (!confirmacion.isConfirmed) return;
                const eliminado = await eliminarDato("lavados", deleteLavado.getAttribute("data-id"));
                // Si la peticion se realizó con exito muestro una alerta informando.
                if (eliminado.code == 200) {
                    const cardEliminar = document.querySelector(`div[data-id="${deleteLavado.getAttribute("data-id")}"]`)

                    await desactivarDato("usuarios/activarUser", lavado.id_lavador);
                    cardEliminar.remove();
                    await successAlert(eliminado.message);
                }
            })

            infoVeh.append(tipoL, deleteLavado);

            // Creo un nuevo elemento strong le agrego su clase -> Bloque que contiene la placa del vehiculo
            const placaIng = document.createElement('strong');
            placaIng.classList.add("card__plate");
            placaIng.textContent = lavado.placa;

            // Creo un nuevo elemento div le agrego sus clases y su atributo -> Bloque que contiene las acciones de los lavados
            const accionesIng = document.createElement('div');
            accionesIng.classList.add("card__space", "space");

            // Creo un nuevo elemento a que será el encargado de redirigir al formulario donde se edita
            const verLavado = document.createElement('a');
            verLavado.classList.add("space__icon");
            verLavado.setAttribute("data-id", lavado.id);
            const iconVer = document.createElement('i');
            iconVer.classList.add("ri-eye-fill");
            verLavado.append(iconVer);
            verLavado.addEventListener("click", async () => {
                const lavadoInformacion = await obtenerDatos(`lavados/enProceso/${verLavado.getAttribute("data-id")}`);
                console.log(lavadoInformacion); 

                if (lavadoInformacion.code == 200) {
                    const { data } = lavadoInformacion;
                    infoAlertHTML("Información de lavado",
                        `<b>Placa:</b> ${data.placa}<br>
                        <b>Marca:</b> ${data.marca_vehiculo}<br>
                        <b>Tipo:</b> ${data.tipo_vehiculo}<br>
                        <b>Clave:</b> ${data.clave}<br><br>
                        <b>Cedula conductor:</b> ${data.cedula_conductor}<br>
                        <b>Nombre Conductor:</b> ${data.nombre_conductor}<br>
                        <b>Telefono:</b> ${data.telefono_conductor}<br><br>
                        <b>Tipo de Lavado:</b> ${data.tipo_lavado}<br>
                        <b>Lavador:</b> ${data.nombre_lavador}
                        `
                    )
                }
            });

            // Creo un nuevo elemento a que será el encargado de redirigir al formulario donde se asigna lavado
            const pagarLav = document.createElement('a');
            pagarLav.classList.add("space__icon", "space__icon--scale");
            pagarLav.setAttribute("href", `#/lavados/pagar/id=${lavado.id}`);
            const iconPagar = document.createElement('i');
            iconPagar.classList.add("ri-money-dollar-circle-line");
            pagarLav.append(iconPagar);

            accionesIng.append(verLavado, pagarLav);

            // Creo un nuevo elemento div le agrego su clase y su atributo -> Bloque que contiene el nombre del lavador.
            const infoLavador = document.createElement('div');
            infoLavador.classList.add("card__washer");
            const lavadorVeh = document.createElement('small');
            lavadorVeh.textContent = lavado.nombre_lavador;
            const iconLavador = document.createElement('i');
            iconLavador.classList.add("ri-user-5-fill", "card__icon");

            infoLavador.append(lavadorVeh, iconLavador);

            // console.log(vehiculoIng);

            card.append(infoVeh, placaIng, accionesIng, infoLavador);

            // Por ultimo agrego la card al contendor de los lavados. 
            contenedor.append(card);
        }
    } catch (error) {
        console.log(error);
    }
}