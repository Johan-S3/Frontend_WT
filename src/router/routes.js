import { loginController } from "../views/auth/login/loginController";
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
    // crear: {
    //   path: `usuarios/crear/index.html`,
    //   controlador: crearUsuariosController,
    //   private: true
    // },
    // editar: {
    //   path: `usuarios/actualizar/index.html`,
    //   controlador: actualizarUsuariosController,
    //   private: true
    // }
  },
  // inicio: {
  //   path: "inicio/index.html",
  //   controlador: inicioController,
  //   private: true
  // },
  // ingresos: {
  //   path: "ingresos/index.html",
  //   controlador: ingresosController,
  //   private: true
  // },
  // // Grupo de rutas

  // lavadores: {
  //   "/": {
  //     path: `lavadores/listar/index.html`,
  //     controlador: lavadoresController,
  //     private: true
  //   },
  //   crear: {
  //     path: `lavadores/crear/index.html`,
  //     controlador: crearLavadoresController,
  //     private: true
  //   },
  //   editar: {
  //     path: `lavadores/actualizar/index.html`,
  //     controlador: actualizarLavadorController,
  //     private: true
  //   }
  // },
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