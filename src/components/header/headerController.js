export const headerController = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));


  const nombreUser = document.querySelector(".header__nameUser");
  const rolUser = document.querySelector(".header__nameRol");

  nombreUser.textContent = usuario.nombre;
  rolUser.textContent = usuario.nombre_rol;

  const perfil = document.querySelector(".header__icon");

  perfil.addEventListener("click", () => {
    window.location.href = "#/perfil/"
  })


  const menuCheckbox = document.getElementById("menuCheckbox");
  const appAside = document.getElementById("app-aside");

  const aside = document.querySelector(".aside");

  menuCheckbox.addEventListener("change", () => {
  if (menuCheckbox.checked) {
    // Cuando está activo
    appAside.style.display = "flex";
    appAside.style.position = "absolute";
    appAside.style.bottom = "0";
    appAside.style.left = "0";
    appAside.style.zIndex = "10000";
    appAside.style.height = "calc(100% - 60px)";
    
    aside.style.display = "flex";
    aside.style.position = "absolute";
    aside.style.top = "0";
    aside.style.left = "0";
    aside.style.zIndex = "10000";
    aside.style.height = "100%";
    aside.style.filter = "none";
  } else {
    // Cuando está desactivado
    aside.style.display = "none";
    appAside.style.display = "none";

  }
});
}