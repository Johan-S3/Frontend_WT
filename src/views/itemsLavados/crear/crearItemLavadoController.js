
/* ------------------ IMPORTACIONES ------------------  */
// Realizo todas las importaciones correspondientes de las funciones necesarias.
import { errorAlert, successAlert } from "../../../helpers/alertas.js";
import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module.js";
import { crearDato, obtenerDatos } from "../../../helpers/peticiones.js";


export const crearItemLavadoController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */

  // Obtengo la referencia del formulario por el ID
  const formRegistro = document.getElementById("form-Registro");

  // Obtengo la referencia de las entradas de texto y de seleccion del formulario por su name
  const nombre = formRegistro.querySelector('input[name="nombre"]');
  const descripcion = formRegistro.querySelector('input[name="descripcion"]');
  const valor = formRegistro.querySelector('input[name="valor"]');
  const selectTipoVeh = formRegistro.querySelector('select[name="tipoVehiculo"]');

  await cargarTiposVehiculos();

  /* ------------------ EVENTOS ------------------  */
  // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
  nombre.addEventListener('keydown', validarLetras);
  descripcion.addEventListener('keydown', validarLetras);
  valor.addEventListener('keydown', validarNumeros);

  // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
  nombre.addEventListener("keypress", (e) => limitar(e, 25));
  descripcion.addEventListener("keypress", (e) => limitar(e, 100));
  valor.addEventListener("keypress", (e) => limitar(e, 7));

  // Declaro y defino un arreglo con los campos del formulario.
  const campos = [nombre, descripcion, valor, selectTipoVeh];

  // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
  campos.forEach(campo => {
    campo.addEventListener("blur", outFocus);
  });

  // Al formualrio le agrego el evento submit
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;

    // Creo un objeto con los valores agregados en el formualrio.
    const itemLavado = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      valor: valor.value,
      id_tipo_vehiculo: selectTipoVeh.value,
    }

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
      const respuesta = await crearDato("itemsLavados", itemLavado);
    //   console.log(respuesta);

      // Si la petición NO se realizó con exito...
      if (!respuesta.success) {
        let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
        if (Array.isArray(respuesta.erros) && respuesta.erros.length) error = respuesta.erros[0].message; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
        else error = respuesta.erros //Si no es un arreglo solo alamceno el error obtenido en la varaible.
        // Por ultimo muestro el error en una alerta y retorno para no seguir.
        await errorAlert(respuesta.message, error);
        return;
      }

      // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
      const alerta = await successAlert(respuesta.message);
      // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
      if (alerta.isConfirmed) {
        // Reseteo los campos del formulario y se dirige a una vista
        // formRegistro.reset();
        window.location.href = '#/itemsLavados';
      }
    } catch (error) {
      // Imprimo en la consola el error obtenido
      console.error(error);
    }
  })

  /* ------------------ FUNCIONES ------------------  */
  
    // Funcion para cargar los tipos de vehiculos en el la etiqueta option correspondiente
    async function cargarTiposVehiculos() {
      // Asigno en una variable la respues de la peticion de los tipos de vehiculos
      const tiposVehExistentes = await obtenerDatos("tiposVehiculos");
    //   console.log(tiposVehExistentes);

    if(tiposVehExistentes.code == 404){
        await errorAlert("!Ups¡ No se puede crear", "Primero debe agregar tipos de vehiculos")
        window.location.href = "#/tiposVehiculos";
    }
  
      // Recorro los tipos de vehiculos obtenido
      tiposVehExistentes.data.forEach(tipoVehiculo => {
        // Creo un nuevo elemento option le doy el value que es el id del tipoVehiculo y le agrego contenido que es el nombre del tipoVehiculo
        const option = document.createElement('option');
        option.setAttribute("value", tipoVehiculo.id);
        option.textContent = tipoVehiculo.nombre_tipo;
  
        // Por ultimo agrego el rol al option correspondiente. 
        selectTipoVeh.append(option);
      });
    }
}
