import { handleLogout } from "./tools.js";

let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

menuicn.addEventListener("click", () => {
    nav.classList.toggle("navclose");
})

const logout = document.getElementById('logout')

logout.addEventListener('click', (e)=> {
    handleLogout(e)
})