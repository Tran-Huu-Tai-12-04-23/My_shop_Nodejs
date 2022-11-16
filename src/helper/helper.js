const products = require("../model/products");
// const { userActive } = require("../controllers/UserControllers");

helper = {
  showuser: (userName) => {
    if (userName != undefined) {
      return `<span class="name__user">hi, ${userName}</span>`;
    } else {
      return `<span class="name__user">Khách</span>`;
    }
  },
  showOptionsUser: (userName) => {
    if (userName != undefined) {
      return `
        <a href='/user/product/store'>
        <i class='bx bx-cart-download'></i>
        <li>Show my products..</li>
      </a>
      <a href='/user/create_new_item'>
      <i class="fa-solid fa-plus"></i>
        <li>Create new product</li>
      </a>
      <a href="/user/product/bought">
      <i class="fa-solid fa-cash-register"></i>
      <li href="">Ordered</li>
      </a>
      <a href="/user/profile">
        <i class="bx bx-user"></i>
        <li href="">Profile</li>
      </a>
  `;
    } else {
      return ``;
    }
  },
  showLogOut: (userName) => {
    if (userName != undefined) {
      return `<a href="/logout">
      <i class="bx bx-log-out"></i>
      <li href="">Log Out</li>
    </a>`;
    } else {
      return "";
    }
  },
  showLoginRegister: (userName) => {
    if (userName != undefined) {
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
  showChangePass: (userName, idUser) => {
    if (userName != undefined && idUser != undefined) {
      return `<a href='/user/account/edit/${idUser}'>
        <i class='bx bx-user'></i>
        <li>Change Password</li>
      </a>`;
    } else {
      return "";
    }
  },
  showAvatar: (userName) => {
    if (userName != undefined) {
      return `<img src="/uploads/${userName}_avatar.jpg" alt="${userName}" class="avatar__img" class="avatar__shop"/>`;
    }
    return `<img src="/uploads/default.jpg" alt="" class="avatar__img" />`;
  },
  calTotals: (totals) => {
    return totals + 24;
  },
  showAmountCart: (amount) => {
    if (amount > 0) {
      return `<span class="amount__cart__user">${amount}</span>`;
    }
    return "";
  },
  getLength: (item) => {
    return Object.keys(item).length > -0
      ? `<span>${Object.keys(item).length}</span>`
      : "";
  },

  getCost: (cost, amount) => {
    return cost * amount;
  },
};
module.exports = helper;
