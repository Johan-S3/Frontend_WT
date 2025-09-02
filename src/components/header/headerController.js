export const headerController = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    console.log(usuario);
    

    const nombreUser = document.querySelector(".header__nameUser");
    const rolUser = document.querySelector(".header__nameRol");
    
    nombreUser.textContent = usuario.nombre;
    rolUser.textContent = usuario.nombre_rol;
}