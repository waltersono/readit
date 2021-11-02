const { ipcRenderer } = require("electron");
const items = require("./items");

const btnShowModal = document.querySelector("#show-modal"),
  btnCloseModal = document.querySelector("#close-modal"),
  btnAddItem = document.querySelector("#add-item"),
  inputUrl = document.querySelector("#url"),
  inputSearch = document.querySelector("#search"),
  modal = document.querySelector("#modal");

const toggleModalButtons = () => {
  if (btnAddItem.disabled == true) {
    btnAddItem.disabled = false;
    btnAddItem.style.opacity = "1";
    btnAddItem.inneText = "Add Item";
    btnCloseModal.style.display = "inline";
  } else {
    btnAddItem.disabled = true;
    btnAddItem.style.opacity = "0.5";
    btnAddItem.inneText = "Adding...";
    btnCloseModal.style.display = "none";
    inputUrl.blur();
  }
};

inputSearch.addEventListener("keyup", (e) => {
  // Remove selection on selected item if it exits
  document.querySelector(".selected")?.classList.remove("selected");

  // initialize counter
  let count = 0;

  // Loop through every item
  Array.from(document.querySelectorAll(".read-item")).forEach((item) => {
    // Check if there is a item title that matches search value
    const hasMatch = item.innerText.toLowerCase().includes(inputSearch.value);

    item.style.display = hasMatch ? "flex" : "none";

    // If there is a match
    if (hasMatch) {
      // increase counter of matched items
      count++;

      // Enable matched items and disabled unmatched

      // Select the first match item
      if (count === 1) {
        item.classList.add("selected");
      }
    }
  });
});

btnShowModal.addEventListener("click", () => {
  modal.style.display = "flex";
  inputUrl.focus();
});

btnCloseModal.addEventListener("click", () => {
  modal.style.display = "none";
});

btnAddItem.addEventListener("click", () => {
  if (inputUrl.value) {
    ipcRenderer.send("new-item", inputUrl.value);
    toggleModalButtons();
  }
});

inputUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") btnAddItem.click();
});

// IPC RENDERER LISTENERS

ipcRenderer.on("new-item-success", (e, newItem) => {
  items.addItem(newItem);
  toggleModalButtons();
  modal.style.display = "none";
  inputUrl.value = "";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown")
    items.changeSelection(e.key);

  if (e.key === "Escape") {
    if (modal.style.display === "flex") modal.style.display = "none";
  }
});

ipcRenderer.on("menu-add-item", (e) => {
  btnShowModal.click();
});

ipcRenderer.on("menu-open", (e) => {
  items.open();
});

ipcRenderer.on("menu-delete", (e) => {
  items.delete(items.getSelectedItem().index);
});

ipcRenderer.on("menu-search", (e) => {
  inputSearch.focus();
});

ipcRenderer.on("menu-open-native", (e) => {
  items.openNative();
});
