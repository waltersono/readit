const btnDone = document.createElement("button");

btnDone.setAttribute("type", "button");
btnDone.innerText = "Done";
btnDone.style.position = "fixed";
btnDone.style.right = "15px";
btnDone.style.bottom = "15px";
btnDone.style.zIndex = "1000";
btnDone.style.color = "white";
btnDone.style.backgroundColor = "dodgerblue";
btnDone.style.outline = "none";
btnDone.style.border = "none";
btnDone.style.borderRadius = "5px";
btnDone.style.padding = "10px 15px";

btnDone.addEventListener("click", (e) => {
  e.preventDefault();

  window.opener.postMessage(
    {
      action: "delete-reader-item",
      index: "{{index}}",
    },
    "*"
  );
});

document.getElementsByTagName("body")[0].append(btnDone);
