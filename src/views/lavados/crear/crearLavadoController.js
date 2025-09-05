import { errorAlert, successAlert } from "../../../helpers/alertas";
import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module";
import { crearDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

// Variables globales en el que se almacenará un valor booleano para indicar si existen las entidades y sus ID.
let existeConductor = false;
let idConductor = 0;
let idRol = 0;

let existeVehiculo = false;
let idVehiculo = 0;

export const crearLavadoController = async (parametros = null) => {

    existeConductor = false;
    idConductor = 0;
    idRol = 0;

    existeVehiculo = false;
    idVehiculo = 0;

    // Obtengo la placa del parametro recibido.
    const { placa } = parametros;

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");
    formRegistro.reset();

    // Obtengo los elementos del vehiculo en el registro. 
    const placaVeh = document.querySelector('input[name="placa"]');
    const marca = document.querySelector('input[name="marca"]');
    const modelo = document.querySelector('input[name="modelo"]');
    const clave = document.querySelector('input[name="clave"]');
    const tipoVeh = document.querySelector('select[name="typeVeh"]');
    const servicioVeh = document.querySelector('select[name="typeSer"]')

    // Obtengo los elementos del conductor del vehiculo.
    const cedula = document.querySelector('input[name="cedula"]');
    const nombre = document.querySelector('input[name="nombre"]');
    const telefono = document.querySelector('input[name="telefono"]');
    const correo = document.querySelector('input[name="correo"]');

    // Le asigno a la entra de texto de la placa la placa recibida como parametro.
    placaVeh.value = placa.toUpperCase();
    // Deshabilito la entrada de texto de la placa.
    placaVeh.disabled = true;

    // Busco el vehiculo por la placa ingresada
    const vehiculo = await obtenerDatos(`vehiculos/placa/${placa}`);
    // console.log(vehiculo);
    if (vehiculo.code == 200) {
        existeVehiculo = true;
        idVehiculo = vehiculo.data.id;
    }

    // Llamo a las funciones donde cargo los tipos de vehiculos y los servicios registrados en la base de datos en los elementos correspondientes.
    await cargarTipoVehiculos(tipoVeh);
    await cargarServicios(servicioVeh);

    // Si el vehiculo existe...
    if (existeVehiculo) {
        // Hago consulta para traer los datos del vehiculo por el id
        const vehiculoExiste = await obtenerDatos(`vehiculos/${idVehiculo}`);

        // Obtengo esos datos para agregarlos a los campos correspondientes
        const datosVehiculo = vehiculoExiste.data[0];

        marca.value = datosVehiculo.marca_vehiculo;
        modelo.value = datosVehiculo.modelo_vehiculo;
        if (datosVehiculo.clave != null) clave.value = datosVehiculo.clave;
        tipoVeh.value = datosVehiculo.id_tipo_vehiculo;
        servicioVeh.value = datosVehiculo.id_servicio_vehiculo;
    }


    /* ------------------ EVENTOS ------------------  */

    // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
    modelo.addEventListener('keydown', validarNumeros);
    clave.addEventListener('keydown', validarNumeros);
    cedula.addEventListener('keydown', validarNumeros);
    nombre.addEventListener('keydown', validarLetras);
    telefono.addEventListener('keydown', validarNumeros);

    // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
    placaVeh.addEventListener("keypress", (e) => limitar(e, 6));
    marca.addEventListener("keypress", (e) => limitar(e, 20));
    modelo.addEventListener("keypress", (e) => limitar(e, 4));
    clave.addEventListener("keypress", (e) => limitar(e, 10));
    cedula.addEventListener("keypress", (e) => limitar(e, 10));
    nombre.addEventListener("keypress", (e) => limitar(e, 40));
    telefono.addEventListener("keypress", (e) => limitar(e, 10));
    correo.addEventListener("keypress", (e) => limitar(e, 50));

    // Declaro y defino un arreglo con los campos del formulario.
    const campos = [placaVeh, marca, modelo, clave, tipoVeh, servicioVeh, cedula, nombre, telefono, correo];

    // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
    campos.forEach(campo => {
        campo.addEventListener("blur", outFocus);
    });

    // Agrego evento para que al perder el enfoque el camnpo de la cedula realice una consulta.
    cedula.addEventListener("blur", async () => {
        // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta si el conductor ingresado con ese numero de cedula ya existe.
        const conductor = await obtenerDatos(`usuarios/cedula/${cedula.value}`);

        // Si el codigo de la peticion es 200. Es decir, existo... Piloto encontrado, entonces...
        if (conductor.code == 200) {
            // La data de la peticion la destructuro.
            const { data } = conductor;

            // Le asigno a los campos correspondiente el resultado de la peticion.
            nombre.value = data[0].nombre;
            telefono.value = data[0].telefono;
            correo.value = data[0].correo;

            // Le asigno a la variable existeConductor el valor de true, que indica que el conductor si existe en la base de datos con ese numero de cedula.
            // Y a la variable idConductor el id del conductor existente obtenido.
            existeConductor = true;
            idConductor = data[0].id;
            idRol = data[0].id_rol;
        } else {
            // Si el codigo de la peticion no es 200. Es decir que no exite. Entonces, le asigno a los campos un valor vacio
            nombre.value = "";
            telefono.value = "";
            correo.value = "";

            // Y vuelvo a poner las variables temporales con el valor por defecto.
            existeConductor = false;
            idConductor = 0;
            idRol = 0;
        }
    })



    // Al formualrio le agrego el evento submit
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // Creo un objeto vehiculo con los valores agregados en el formualrio.
        let vehiculo = {
            placa: placaVeh.value,
            marca_vehiculo: marca.value,
            modelo_vehiculo: modelo.value,
            id_tipo_vehiculo: tipoVeh.value,
            id_servicio_vehiculo: servicioVeh.value,
            clave: clave.value
        }

        // Creo un objeto conductor con los valores agregados en el formualrio.
        let conductor = {};
        if (idRol != 0) {
            conductor = {
                cedula: cedula.value,
                nombre: nombre.value,
                telefono: telefono.value,
                correo: correo.value,
                id_rol: idRol,
            }
        } else {
            conductor = {
                cedula: cedula.value,
                nombre: nombre.value,
                telefono: telefono.value,
                correo: correo.value,
                id_rol: 5,
            }
        }

        // Creo un objeto lavado con sus atributos. Los demas atributos se agregarán de acuerdo al resultado de las peticiones siguientes.
        let lavado = {
            id_estado: 1
        };

        // Try..catch para poder ver el error.
        try {
            if (!existeVehiculo) {
                // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el vehiculo.
                const vehiculoCreado = await crearDato(`vehiculos`, vehiculo);
                console.log(vehiculoCreado);

                // Si el codigo de la peticion no es 201. Es decir no se creó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
                // Y retorno para no seguir ejecutando el codigo.
                if (vehiculoCreado.code != 201) {
                    mostrarErrores(vehiculoCreado);
                    return;
                }

                // Asigno a varaible temporal el id del vehiculo
                idVehiculo = vehiculoCreado.data.id;
            } else {
                // En una variable almaceno la respuesta de hacer fetch a la ruta que ediatar el vehiculo.
                const vehiculoEditado = await editarDato(`vehiculos`, idVehiculo, vehiculo);
                console.log(vehiculoEditado);

                // Si el codigo de la peticion no es 201. Es decir no se creó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
                // Y retorno para no seguir ejecutando el codigo.
                if (vehiculoEditado.code != 200) {
                    mostrarErrores(vehiculoEditado);
                    return;
                }

                // Asigno a varaible temporal el id del vehiculo
                idVehiculo = vehiculoEditado.data.id;
                existeVehiculo = true;
            }

            // Creo la propiedad id_vehiculo en el objeto lavado y le asigno el id de la data al crear el vehiculo
            lavado.id_vehiculo = idVehiculo;

            // console.log(lavado); return

            // Si existePiloto es true. Es decir, la cedula que se ingreso en el campo cedula ya existe entonces...
            if (existeConductor) {
                // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el conductor del vehiculo.
                const conductorActualizado = await editarDato(`usuarios`, idConductor, conductor);
                console.log(conductorActualizado);

                // Si el codigo de la peticion no es 200. Es decir no se actualizó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
                // Y retorno para no seguir ejecutando el codigo.
                if (conductorActualizado.code != 200) {
                    mostrarErrores(conductorActualizado);
                    return;
                }

                // Creo la propiedad id_conductor en el objeto lavado y le asigno el id del piloto obtenido anteriormente.
                lavado.id_conductor = conductorActualizado.data.id;
            } else {
                // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el propietario, piloto o dueño del vehiculo.
                const conductorCreado = await crearDato(`usuarios`, conductor);
                console.log(conductorCreado);

                // Si el codigo de la peticion no es 201. Es decir no se creó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
                // Y retorno para no seguir ejecutando el codigo.
                if (conductorCreado.code != 201) {
                    mostrarErrores(conductorCreado);
                    return;
                }

                // Creo la propiedad id_duenio_vehiculo en el objeto ingreso y le asigno el id de la data al crear el piloto o propietario.
                lavado.id_conductor = conductorCreado.data.id;
            }


            // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el lavado con sus detalles.
            const registroLavado = await crearDato(`lavados`, lavado)
            console.log(registroLavado);

            // Si la petición NO se realizó con exito...
            if (registroLavado.code != 201) {
                mostrarErrores(registroLavado);
                return;
            }

            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(registroLavado.message);
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

// Funcion para cargar los tipos de vehiculos en el elemento correspondiente
async function cargarTipoVehiculos(contendor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los tipos de vehiculos
        const tiposVehiculos = await obtenerDatos("tiposvehiculos");
        // console.log(tiposVehiculos);

        // Recorro los tipos de vehiculos obtenidos
        tiposVehiculos.data.forEach(tipoVehiculo => {
            // Creo un nuevo elemento option y le agrego el atributo value con el id del tipo de vehiculo y contenido que es el nombre del tipo de vehiculo
            const option = document.createElement('option');
            option.setAttribute("value", tipoVehiculo.id)
            option.textContent = tipoVehiculo.nombre_tipo;

            // Por ultimo agrego el option al contendor de los tipos de vehiculos. 
            contendor.append(option);
        })
    } catch (error) {
        console.log(error);
    }
}

// Funcion para cargar los servicios en el elemento correspondiente
async function cargarServicios(contendor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los servicios
        const servicios = await obtenerDatos("serviciosVehiculos");
        // console.log(servicios);

        // Recorro los servicios obtenidos
        servicios.data.forEach(servicio => {
            // Creo un nuevo elemento option y le agrego el atributo value con el id del servicio y contenido que es el nombre del servicio
            const option = document.createElement('option');
            option.setAttribute("value", servicio.id)
            option.textContent = servicio.nombre_servicio;

            // Por ultimo agrego el option al contendor de los tipos de vehiculos. 
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