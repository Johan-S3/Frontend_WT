import { loginController } from "../views/auth/login/loginController";
import { crearItemLavadoController } from "../views/itemsLavados/crear/crearItemLavadoController";
import { editarItemLavadoController } from "../views/itemsLavados/editar/editarItemLavadoController";
import { itemsLavadosController } from "../views/itemsLavados/listar/itemsLavadosController";
import { crearItemTipoLavadoController } from "../views/itemsTiposLavados/crear/crearItemLavadoController";
import { itemsTiposLavadosController } from "../views/itemsTiposLavados/listar/itemsTiposLavadosController";
import { verItemsTiposLavadosController } from "../views/itemsTiposLavados/ver/verItemsTipoLavadoController";
import { perfilController } from "../views/perfil/perfilController";
import { crearServicioVehiculoController } from "../views/serviciosVehiculos/crear/crearServicioVehiculoController";
import { editarServicioVehiculoController } from "../views/serviciosVehiculos/editar/editarServicioVehiculoController";
import { serviciosVehiculosController } from "../views/serviciosVehiculos/listar/servicioVehiculoController";
import { crearTipoLavadoController } from "../views/tiposLavados/crear/crearTipoLavadoController";
import { editarTipoLavadoController } from "../views/tiposLavados/editar/editarTipoLavadoController";
import { tiposLavadosController } from "../views/tiposLavados/listar/tiposLavadosController";
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
  itemsLavados: {
    "/": {
      path: `itemsLavados/listar/index.html`,
      controlador: itemsLavadosController,
      private: true,
      permit: "items_lavados.index"
    },
    crear: {
      path: `itemsLavados/crear/index.html`,
      controlador: crearItemLavadoController,
      // controlador: () => {},
      private: true,
      permit: "items_lavados.create"
    },
    editar: {
      path: `itemsLavados/editar/index.html`,
      controlador: editarItemLavadoController,
      private: true,
      permit: "items_lavados.update"
    }
  },
  tiposLavados: {
    "/": {
      path: `tiposLavados/listar/index.html`,
      controlador: tiposLavadosController,
      private: true,
      permit: "tipos_lavados.index"
    },
    crear: {
      path: `tiposLavados/crear/index.html`,
      controlador: crearTipoLavadoController,
      // controlador: () => {},
      private: true,
      permit: "tipos_lavados.create"
    },
    editar: {
      path: `tiposLavados/editar/index.html`,
      controlador: editarTipoLavadoController,
      private: true,
      permit: "tipos_lavados.update"
    }
  },
  itemsTiposLavados: {
    "/": {
      path: `itemsTiposLavados/listar/index.html`,
      controlador: itemsTiposLavadosController,
      private: true,
      permit: "items_tipos_lavados.index"
    },
    crear: {
      path: `itemsTiposLavados/crear/index.html`,
      controlador: crearItemTipoLavadoController,
      // controlador: () => {},
      private: true,
      permit: "items_tipos_lavados.create"
    },
    ver: {
      path: `itemsTiposLavados/ver/index.html`,
      controlador: verItemsTiposLavadosController,
      private: true,
      permit: "items_tipos_lavados.index"
    }
  },
  // ingresos: {
  //   path: "ingresos/index.html",
  //   controlador: ingresosController,
  //   private: true
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