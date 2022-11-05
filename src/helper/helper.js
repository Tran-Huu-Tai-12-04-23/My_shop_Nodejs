const { userActive } = require("../controllers/UserControllers");
const products = require("../model/products");
const cartStoreDB = require("../model/cartStore");
helper = {
  showuser: () => {
    if (userActive.username != undefined) {
      return `<span class="name__user">hi, ${userActive.username}</span>`;
    } else {
      return `<span class="name__user">Khách</span>`;
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
      return `<a href="/logout">
      <i class="bx bx-log-out"></i>
      <li href="">Log Out</li>
    </a>`;
    } else {
      return "";
    }
  },
  showLoginRegister: () => {
    if (userActive.username != undefined) {
      return ``;
    } else {
      return `<a href="/login">
                  <i class="bx bx-log-in"></i>
                  <li >Login</li>
                </a>
                <a href="/register">
                  <i class="bx bx-edit-alt"></i>
                  <li >Register</li>
                </a>`;
    }
  },
  showNumberCart: () => {
    return "";
  },
  showChangePass: () => {
    if (userActive.username != undefined && userActive.id != undefined) {
      return `<a href=''>
        <i class='bx bx-user'></i>
        <li href='/user/account/edit/${userActive.id}'>Change Password</li>
      </a>`;
    } else {
      return "";
    }
  },
  showAvatar: () => {
    if (userActive.id != undefined && userActive.username != undefined) {
      return `<img src="/uploads/${userActive.username}_avatar.jpg" alt="" class="avatar__img" />`;
    }
    return `<img src="/uploads/default.jpg" alt="" class="avatar__img" />`;
  },
};
module.exports = helper;
