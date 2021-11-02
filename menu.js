const { Menu, app } = require("electron");

module.exports = (appWin) => {
  const template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add Item",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            appWin.send("menu-add-item");
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWin.send("menu-open");
          },
        },
        {
          label: "Delete",
          accelerator: "CmdOrCtrl+D",
          click: () => {
            appWin.send("menu-delete");
          },
        },
        {
          label: "Search",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            appWin.send("menu-search");
          },
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift",
          click: () => {
            appWin.send("menu-open-native");
          },
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};
