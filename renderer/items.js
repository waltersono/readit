const fs = require("fs");
const { shell } = require("electron");

const itemsContainer = document.querySelector("#items");

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (e, data) => {
  readerJS = data.toString();
});

exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

window.addEventListener("message", (e) => {
  if (e.data.action === "delete-reader-item") {
    this.delete(e.data.index);

    e.source.close();
  }
});

exports.getSelectedItem = () => {
  const selectedItem = document.querySelector(".selected");

  let itemIndex = 0;

  let child = selectedItem;

  while ((child = child.previousElementSibling) != null) itemIndex++;

  return { node: selectedItem, index: itemIndex };
};

exports.select = (e) => {
  document.querySelector(".selected")?.classList.remove("selected");

  e.currentTarget.classList.add("selected");
};

exports.changeSelection = (direction) => {
  const selectedItem = this.getSelectedItem().node;

  if (direction === "ArrowUp" && selectedItem.previousElementSibling) {
    selectedItem.classList.remove("selected");
    selectedItem.previousElementSibling.classList.add("selected");
  }

  if (direction === "ArrowDown" && selectedItem.nextElementSibling) {
    selectedItem.classList.remove("selected");
    selectedItem.nextElementSibling.classList.add("selected");
  }
};

exports.delete = (itemIndex) => {
  document.querySelector(".selected")?.remove();

  this.storage.splice(itemIndex, 1);

  this.save();

  if (this.storage.length) {
    const newItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    document
      .querySelectorAll(".read-item")
      [newItemIndex].classList.add("selected");
  }
};

exports.openNative = () => {
  const selectedItem = this.getSelectedItem();

  const contentUrl = selectedItem.node.dataset.url;

  shell.openExternal(contentUrl);
};

exports.open = () => {
  const selectedItem = this.getSelectedItem();

  const contentUrl = selectedItem.node.dataset.url;

  const readerWindow = window.open(
    contentUrl,
    "",
    `
  width=1000,height=800,nodeIntegration=0,contextIsolation=1`
  );

  readerWindow.eval(readerJS.replace("{{index}}", selectedItem.index));
};

exports.addItem = (item, isNew = true) => {
  const itemNode = document.createElement("div");

  itemNode.classList.add("read-item");

  itemNode.setAttribute("data-url", item.url);

  itemNode.innerHTML = `<img src='${item.screenshot}'/><h2>${item.title}</h2>`;

  itemNode.addEventListener("click", this.select);

  itemNode.addEventListener("contextmenu", this.select);

  itemNode.addEventListener("dblclick", this.open);

  itemsContainer.append(itemNode);

  if (itemsContainer.childElementCount === 1)
    itemNode.classList.add("selected");

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => {
  this.addItem(item, false);
});
