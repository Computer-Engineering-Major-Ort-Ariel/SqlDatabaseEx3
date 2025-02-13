import { send } from "../utilities";
import { getUserId } from "./funcs";
import { Transaction, User } from "./types";

let logOutButton = document.querySelector("#logOutButton") as HTMLButtonElement;
let nameDiv = document.querySelector("#nameDiv") as HTMLDivElement;
let inboxDiv = document.querySelector("#inboxDiv") as HTMLDivElement;
let historyDiv = document.querySelector("#historyDiv") as HTMLDivElement;
let activityButtons = document.querySelectorAll(".activityButton") as NodeListOf<HTMLButtonElement>;
let modals = document.querySelectorAll(".modal") as NodeListOf<HTMLDivElement>;
let transactionInputs = document.querySelectorAll(".transactionInput") as NodeListOf<HTMLInputElement>;
let selects = document.querySelectorAll(".recipient") as NodeListOf<HTMLSelectElement>;
let reasonInputs = document.querySelectorAll(".reasonInput") as NodeListOf<HTMLInputElement>;
let sendButtons = document.querySelectorAll(".sendButton") as NodeListOf<HTMLButtonElement>;

logOutButton.onclick = function () {
  localStorage.removeItem("userId");
  location.href = "index.html";
}

for (let i = 0; i < modals.length; i++) {
  let activityButton = activityButtons[i];
  let modal = modals[i];
  let input = transactionInputs[i];
  let select = selects[i];
  let reasonInput = reasonInputs[i];
  let sendButton = sendButtons[i];

  activityButton.onclick = function () {
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
  }

  modal.onclick = function (e) {
    if (e.target == modal) {
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";
    }
  }

  sendButton.onclick = async function () {
    let amount = parseFloat(input.value);
    if (isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    let recipientId = select.value;
    if (recipientId == "") {
      alert("Please select a valid recipient.");
      return;
    }

    let reason = reasonInput.value;

    if (i == 0) {
      amount *= -1;
    }

    let toMe = i == 1;

    await send("transfer", [userId, recipientId, amount, reason, toMe]);

    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
  }
}



let userId = await getUserId();

if (userId == null) {
  location.href = "index.html";
} else {
  let username = await send("getUsername", userId) as string;

  nameDiv.innerText = "Hello, " + username;
}


let contacts = await send("getContacts", userId) as User[];

for (let i = 0; i < selects.length; i++) {
  let select = selects[i];

  for (let j = 0; j < contacts.length; j++) {
    let contact = contacts[j];

    let option = document.createElement("option");
    option.value = contact.Id;
    option.innerText = contact.Username;
    select.appendChild(option);
  }
}


let inbox = await send("getInbox", userId) as Transaction[];

console.log(inbox);

for (let i = 0; i < inbox.length; i++) {
  let transaction = inbox[i];

  let transactionDiv = document.createElement("div");
  transactionDiv.classList.add("request");
  inboxDiv.appendChild(transactionDiv);

  let itemsDiv = document.createElement("div");
  itemsDiv.classList.add("itemsRow");
  transactionDiv.appendChild(itemsDiv);

  let leftDiv = document.createElement("div");
  itemsDiv.appendChild(leftDiv);

  let recipientDiv = document.createElement("div");
  recipientDiv.innerText = transaction.Sender.Username;
  leftDiv.appendChild(recipientDiv);

  let reasonDiv = document.createElement("div");
  reasonDiv.classList.add("reason");
  reasonDiv.innerText = transaction.Reason;
  leftDiv.appendChild(reasonDiv);

  let amountDiv = document.createElement("div");
  amountDiv.innerText = transaction.Amount.toString() + "₪";
  itemsDiv.appendChild(amountDiv);

  let aButtonsDiv = document.createElement("div");
  aButtonsDiv.classList.add("approvalButtons");
  transactionDiv.appendChild(aButtonsDiv);

  let approveButton = document.createElement("button");
  approveButton.classList.add("approvalButton");
  approveButton.innerText = "Approve";
  approveButton.onclick = async function () {
    await send("approve", transaction.Id);
    transactionDiv.remove();
  };
  aButtonsDiv.appendChild(approveButton);

  let rejectButton = document.createElement("button");
  rejectButton.classList.add("approvalButton");
  rejectButton.innerText = "Reject";
  rejectButton.onclick = async function () {
    await send("reject", transaction.Id);
    transactionDiv.remove();
  }
  aButtonsDiv.appendChild(rejectButton);
}


let history = await send("getHistory", userId) as Transaction[];

console.log("history", history);

for (let i = 0; i < history.length; i++) {
  let transaction = history[i];

  let transactionDiv = document.createElement("div");
  transactionDiv.classList.add("request");
  historyDiv.appendChild(transactionDiv);

  let itemsDiv = document.createElement("div");
  itemsDiv.classList.add("itemsRow");
  transactionDiv.appendChild(itemsDiv);

  let leftDiv = document.createElement("div");
  itemsDiv.appendChild(leftDiv);

  let nameDiv = document.createElement("div");
  if (transaction.Sender.Id == userId) {
    nameDiv.innerText = "To " + transaction.Recipient.Username;
  }
  else {
    nameDiv.innerText = "From " + transaction.Sender.Username;
  }
  leftDiv.appendChild(nameDiv);

  let reasonDiv = document.createElement("div");
  reasonDiv.classList.add("reason");
  reasonDiv.innerText = transaction.Reason;
  leftDiv.appendChild(reasonDiv);

  let amountDiv = document.createElement("div");
  amountDiv.innerText = transaction.Amount.toString() + "₪";
  itemsDiv.appendChild(amountDiv);

  let tImg = document.createElement("img");
  tImg.src = "/website/images/send-white-icon.png";
  if (transaction.Sender.Id == userId) {
    tImg.classList.add("tImg");
  }
  else {
    tImg.classList.add("rImg");
  }
  amountDiv.appendChild(tImg);

  let statusDiv = document.createElement("div");
  statusDiv.classList.add("approvalButtons");
  let status = "Approved";
  if (transaction.Status == 2) {
    status = "Rejected";
  }
  statusDiv.innerText = status;
  transactionDiv.appendChild(statusDiv);
}