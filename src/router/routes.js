import { loginController } from "../views/auth/login/loginController";
import { perfilController } from "../views/perfil/perfilController";
import { crearServicioVehiculoController } from "../views/serviciosVehiculos/crear/crearServicioVehiculoController";
import { editarServicioVehiculoController } from "../views/serviciosVehiculos/editar/editarServicioVehiculoController";
import { serviciosVehiculosController } from "../views/serviciosVehiculos/listar/servicioVehiculoController";
import { crearTipoVehiculoController } from "../views/tiposVehiculos/crear/crearTipoVehiculoController";
import { editarTipoVehiculoController } from "../views/tiposVehiculos/editar/editarTipoVehiculo";
import { tiposVehiculosController } from "../views/tiposVehiculos/listar/tiposVehiculosController";
import { crearUsuarioController } from "../views/usuarios/crear/crearUsuarioController";
import { editarUsuarioController } from "../views/usuarios/editar/editarUsuarioController";
import { usuariosController } from "../views/usuarios/listar/usuariosController";

export const routes = {
  // Ruta simple
  login: {
    path: "auth/login/index.html",
    // controlador: loginController,
    controlador: loginController,
    private: false
  },
  usuarios: {
    "/": {
      path: `usuarios/listar/index.html`,
      controlador: usuariosController,
      private: true,
      permit: "usuarios.index"
    },
    crear: {
      path: `usuarios/crear/index.html`,
      controlador: crearUsuarioController,
      private: true,
      permit: "usuarios.create"
    },
    editar: {
      path: `usuarios/editar/index.html`,
      controlador: editarUsuarioController,
      private: true,
      permit: "usuarios.update"
    }
  },
  inicio: {
    path: "inicio/inicio.html",
    // controlador: inicioController,
    controlador: () => { },
    private: true
  },
  perfil: {
    path: "perfil/index.html",
    controlador: perfilController,
    private: true
  },
  tiposVehiculos: {
    "/": {
      path: `tiposVehiculos/listar/index.html`,
      controlador: tiposVehiculosController,
      private: true,
      permit: "tipos_vehiculos.index"
    },
    crear: {
      path: `tiposVehiculos/crear/index.html`,
      controlador: crearTipoVehiculoController,
      private: true,
      permit: "tipos_vehiculos.create"
    },
    editar: {
      path: `tiposVehiculos/editar/index.html`,
      controlador: editarTipoVehiculoController,
      private: true,
      permit: "tipos_vehiculos.update"
    }
  },
  serviciosVehiculos: {
    "/": {
      path: `serviciosVehiculos/listar/index.html`,
      controlador: serviciosVehiculosController,
      private: true,
      permit: "servicios_vehiculos.index"
    },
    crear: {
      path: `serviciosVehiculos/crear/index.html`,
      controlador: crearServicioVehiculoController,
      // controlador: () => {},
      private: true,
      permit: "servicios_vehiculos.create"
    },
    editar: {
      path: `serviciosVehiculos/editar/index.html`,
      controlador: editarServicioVehiculoController,
      private: true,
      permit: "servicios_vehiculos.update"
    }
  },
  // ingresos: {
  //   path: "ingresos/index.html",
  //   controlador: ingresosController,
  //   private: true
  // },
  // // Grupo de rutas
  // tipolavados: {
  //   "/": {
  //     path: `tipolavados/listar/index.html`,
  //     controlador: tipoLavadosController,
  //     private: true
  //   },
  //   crear: {
  //     path: `tipolavados/crear/index.html`,
  //     controlador: crearTipoLavadoController,
  //     private: true
  //   },
  //   editar: {
  //     path: `tipolavados/actualizar/index.html`,
  //     controlador: actualizarTipoLavadoController,
  //     private: true
  //   }
  // },
  // vehiculo: {
  //   crear: {
  //     path: `vehiculo/crear/index.html`,
  //     controlador: crearVehiculoController,
  //     private: true
  //   },
  //   registrar: {
  //     path: `vehiculo/actualizar/index.html`,
  //     controlador: registrarVehiculoExistenteController,
  //     private: true
  //   },
  //   editar: {
  //     path: `vehiculo/actualizar/index.html`,
  //     controlador: actualizarVehiculoController,
  //     private: true
  //   }
  // },
  // lavados: {
  //   crear: {
  //     path: `lavados/crear/index.html`,
  //     controlador: crearLavadoController,
  //     private: true
  //   },
  //   editar: {
  //     path: `lavados/actualizar/index.html`,
  //     controlador: actualizarLavadoController,
  //     private: true
  //   }
  // },
  // pago: {
  //   crear: {
  //     path: "pago/index.html",
  //     controlador: pagoController,
  //     private: true
  //   }
  // }
}