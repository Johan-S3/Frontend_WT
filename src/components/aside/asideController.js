import getCookie from "../../helpers/getCookie";

export const asideController = () => {
    const permisos = getCookie("permisos", []);

    if (!permisos.length) return;

    const contenedorItems = document.querySelector(".aside__items");

    permisos.forEach(permiso => {
        if (permiso == "usuarios.index") {
            const [item, icono] = construirItem();

            item.setAttribute("href", "#/usuarios");
            icono.classList.add("ri-team-fill");

            item.append(icono, "Usuarios");
            contenedorItems.append(item);
        }

        if (permiso == "tipos_vehiculos.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/tiposVehiculos");
            icono.classList.add("ri-steering-2-fill");
    
            item.append(icono, "Tipos Vehiculos");
            contenedorItems.append(item);
        }

        if (permiso == "servicios_vehiculos.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/serviciosVehiculos");
            icono.classList.add("ri-hand-coin-fill");
    
            item.append(icono, "Servicios Vehiculos");
            contenedorItems.append(item);
        }

        if (permiso == "tipos_lavados.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/tiposLavados");
            icono.classList.add("ri-car-washing-fill");
    
            item.append(icono, "Tipos Lavados");
            contenedorItems.append(item);
        }

        if (permiso == "items_lavados.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/itemsLavados");
            icono.classList.add("ri-stack-fill");
    
            item.append(icono, "Items Lavados");
            contenedorItems.append(item);
        }

        if (permiso == "items_tipos_lavados.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/itemsTiposLavados");
            icono.classList.add("ri-bubble-chart-fill");
    
            item.append(icono, "IT Lavados");
            contenedorItems.append(item);
        }
        if (permiso == "lavadores.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/lavadores");
            icono.classList.add("ri-team-fill");
    
            item.append(icono, "Lavadores");
            contenedorItems.append(item);
        }

        if (permiso == "lavados.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/lavados");
            icono.classList.add("ri-drop-fill");
    
            item.append(icono, "Lavados");
            contenedorItems.append(item);
        }

        if (permiso == "facturas.index") {
            const [item, icono] = construirItem();
    
            item.setAttribute("href", "#/facturas");
            icono.classList.add("ri-money-dollar-circle-fill");
    
            item.append(icono, "Ingresos");
            contenedorItems.append(item);
        }
    });
}

const construirItem = () => {
    const item = document.createElement("a");
    item.classList.add("item__link");

    const icono = document.createElement("i");
    icono.classList.add("item__icon");

    return [item, icono]
}