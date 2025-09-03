
/* ------------------ IMPORTACIONES ------------------  */
// Realizo todas las importaciones correspondientes de las funciones necesarias.
import { errorAlert, infoAlert, successAlert } from "../../helpers/alertas.js";
import { limitar, outFocus, validarContrasena, validarCorreo, validarFormulario, validarLetras, validarNumeros } from "../../helpers/module.js";
import { crearDato, editarDato, editarUnicoDato, obtenerDatos } from "../../helpers/peticiones.js";


export const perfilController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo la referencia de los formularios por el ID
    const formDatos = document.getElementById("form-datos");
    const formContrasena = document.getElementById("form-contrasena");

    // Obtengo la referencia de las entradas de texto y de seleccion del formulario de datos por su name
    const cedula = formDatos.querySelector('input[name="cedula"]');
    const nombre = formDatos.querySelector('input[name="nombre"]');
    const correo = formDatos.querySelector('input[name="correo"]');
    const telefono = formDatos.querySelector('input[name="telefono"]');
    
    cedula.disabled = true;
    
    // Obtengo la referencia de las entradas de texto y de seleccion del formulario de contraseña por su name
    const contrasenaActal = formContrasena.querySelector('input[name="contrasenaActual"]');
    const nuevaContrasena = formContrasena.querySelector('input[name="contrasenaNueva"]');

    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

    //   Realizo consulta a los usuarios por el id recibido como parametro.
    const usuario = await obtenerDatos(`usuarios/${usuarioLocal.id}`);
    // Destructuro el usuario para solo obtener su data.
    const { data } = usuario;
    const user = data[0];
    console.log(user);

    cedula.value = user.cedula;
    nombre.value = user.nombre;
    correo.value = user.correo;
    telefono.value = user.telefono;

    /* ------------------ EVENTOS ------------------  */
    // Agrego evento para cargar los roles en el select

    // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
    cedula.addEventListener('keydown', validarNumeros);
    nombre.addEventListener('keydown', validarLetras);
    telefono.addEventListener('keydown', validarNumeros);

    // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
    cedula.addEventListener("keypress", (e) => limitar(e, 10));
    nombre.addEventListener("keypress", (e) => limitar(e, 40));
    telefono.addEventListener("keypress", (e) => limitar(e, 10));
    correo.addEventListener("keypress", (e) => limitar(e, 50));

    // Declaro y defino un arreglo con los campos del formulario.
    const campos = [cedula, nombre, correo, telefono, contrasenaActal, nuevaContrasena];

    // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
    campos.forEach(campo => {
        campo.addEventListener("blur", outFocus);
    });

    // Al formualrio le agrego el evento submit
    formDatos.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // VALIDAR FORMATO DEL CORREO
        if (!validarCorreo(correo.value)) {
            // Si el correo tiene otro elemento hermano lo remuevo
            if (correo.nextElementSibling) correo.nextElementSibling.remove();
            // Le agrego una clase al el selector del correo
            correo.classList.add("form__input--empty");

            // Creo un elemento donde se mostrará el mensaje
            const mensaje = document.createElement("span");
            // Le doy una clase al elemento creado
            mensaje.classList.add("form__mensaje");
            // Le agrego un contenido en forma de texto
            mensaje.textContent = "Ingrese un correo válido.";
            // Y lo inserto despues de la entrada de texto
            correo.insertAdjacentElement("afterend", mensaje);

            return; //Por ultimo retorno
        }

        // Creo un objeto con los valores agregados en el formualrio.
        const usuario = {
            cedula: cedula.value,
            nombre: nombre.value,
            correo: correo.value,
            telefono: telefono.value,
            id_rol: user.id_rol
        }

        // Try..catch para poder ver el error.
        try {
            // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
            const respuesta = await editarDato("usuarios", user.id, usuario);

            // console.log(respuesta);
            
            // Si la petición NO se realizó con exito...
            if (!respuesta.success) {
                let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
                if (Array.isArray(respuesta.erros) && respuesta.erros.length != 0) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
                else error = respuesta.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.
                // Por ultimo muestro el error en una alerta y retorno para no seguir.
                await errorAlert(respuesta.message, error);
                return;
            }

            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(respuesta.message);
            // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a la vista de login
                // formRegistro.reset();

                await infoAlert("Informacion de usuario", "Por favor vuelva a iniciar sesion para actualizar la información")
                window.location.href = '#/inicio';
            }
        } catch (error) {
            // Imprimo en la consola el error obtenido
            console.error(error);
        }
    })

    // Al formualrio le agrego el evento submit
    formContrasena.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // VALIDAR FORMATO DEL CORREO
        if (!validarContrasena(nuevaContrasena.value)) {
            // Si la contrasena tiene otro elemento hermano lo remuevo
            if (nuevaContrasena.nextElementSibling) nuevaContrasena.nextElementSibling.remove();
            // Le agrego una clase al el selector del campo contraseña
            nuevaContrasena.classList.add("form__input--empty");

            // Creo un elemento donde se mostrará el mensaje
            const mensaje = document.createElement("span");
            // Le doy una clase al elemento creado
            mensaje.classList.add("form__mensaje");
            // Le agrego un contenido en forma de texto
            mensaje.textContent = "Debe tener: Mínimo 8 caracteres, al menos 1 letra y 1 número";
            // Y lo inserto despues de la entrada de texto
            nuevaContrasena.insertAdjacentElement("afterend", mensaje);

            return; //Por ultimo retorno
        }

        // Creo un objeto con los valores agregados en el formualrio.
        const camposContrasena = {
            contrasena_actual: contrasenaActal.value,
            contrasena_nueva: nuevaContrasena.value,
        }

        // Try..catch para poder ver el error.
        try {
            // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.

            const respuesta = await editarUnicoDato("usuarios/contrasena", user.id, camposContrasena);

            // console.log(respuesta.erros[0]);
            
            // Si la petición NO se realizó con exito...
            if (!respuesta.success) {
                let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
                if (Array.isArray(respuesta.erros) && respuesta.erros.length != 0) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
                else error = respuesta.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.
                // Por ultimo muestro el error en una alerta y retorno para no seguir.
                if (!error) error = respuesta.erros[0];
                await errorAlert(respuesta.message, error);
                return;
            }

            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(respuesta.message);
            // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a la vista de login
                formContrasena.reset();
                window.location.href = '#/inicio';
            }
        } catch (error) {
            // Imprimo en la consola el error obtenido
            console.error(error);
        }
    })

}
