const { userActive } = require("../controllers/UserControllers");
const products = require("../model/products");
const cartStoreDB = require("../model/cartStore");
helper = {
  showuser: () => {
    if (userActive.username != undefined) {
      return "hi, " + userActive.username;
    } else {
      return "khách";
    }
  },
  showDetailMyProduct: () => {
    if (userActive.username != undefined) {
      return `<li class='nav-item'>
          <a class='nav-link' href='/user/product/store'>
            Show my products..
          </a>
        </li>`;
    } else {
      return ``;
    }
  },
  showLogOut: () => {
    if (userActive.username != undefined) {
      return `<li class="nav-item">
      <a class="nav-link" href="/logout">logout</a>
    </li>`;
    } else {
      return "";
    }
  },
  showLoginRegester: () => {
    if (userActive.username != undefined) {
      return ``;
    } else {
      return `
      <li class="nav-item">
        <a class="nav-link" href="/login">Login</a>
      </li>
      <li class="nav-item active">
            <a class="nav-link" href="/regester">Regester
            </a>
      </li>`;
    }
  },
  showNumberCart: () => {
    return "";
  },
  getIdUser: () => {
    return userActive.id;
  },
};
module.exports = helper;
