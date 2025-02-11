import { send } from "../utilities";
import { getUserId } from "./funcs";

let sUsernameInput = document.querySelector("#sUsernameInput") as HTMLInputElement;
let sPasswordInput = document.querySelector("#sPasswordInput") as HTMLInputElement;
let sConfirmInput = document.querySelector("#sConfirmInput") as HTMLInputElement;

let signUpButton = document.querySelector("#signUpButton") as HTMLButtonElement;
let lUsernameInput = document.querySelector("#lUsernameInput") as HTMLInputElement;
let lPasswordInput = document.querySelector("#lPasswordInput") as HTMLInputElement;
let logInButton = document.querySelector("#logInButton") as HTMLButtonElement;

signUpButton.onclick = async function () {
  if (sPasswordInput.value != sConfirmInput.value) {
    alert("Passwords do not match");
    return;
  }

  let userId = await send("signUp", [
    sUsernameInput.value,
    sPasswordInput.value,
  ]) as string | null;

  if (userId == null) {
    alert("Username already exists");
    return;
  }

  localStorage.setItem("userId", userId);

  location.href = "main.html";
};

logInButton.onclick = async function () {
  let userId = await send("logIn", [
    lUsernameInput.value,
    lPasswordInput.value,
  ]) as string | null;

  if (userId == null) {
    alert("Incorrect username or password");
    return;
  }

  localStorage.setItem("userId", userId);

  location.href = "main.html";
};


let userId = await getUserId();

if (userId != null) {
  location.href = "main.html";
}