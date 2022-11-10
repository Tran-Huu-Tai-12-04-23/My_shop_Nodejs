const products = require("../model/products");
const { userActive } = require("../controllers/UserControllers");

helper = {
  showuser: () => {
    if (userActive.name != undefined) {
      return `<span class="name__user">hi, ${userActive.name}</span>`;
    } else {
      return `<span class="name__user">Khách</span>`;
    }
  },
  showOptionsUser: () => {
    if (userActive.name != undefined) {
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
  showLogOut: () => {
    if (userActive.name != undefined) {
      return `<a href="/logout">
      <i class="bx bx-log-out"></i>
      <li href="">Log Out</li>
    </a>`;
    } else {
      return "";
    }
  },
  showLoginRegister: () => {
    if (userActive.name != undefined) {
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
    if (userActive.name != undefined && userActive.id != undefined) {
      return `<a href='/user/account/edit/${userActive.id}'>
        <i class='bx bx-user'></i>
        <li>Change Password</li>
      </a>`;
    } else {
      return "";
    }
  },
  showAvatar: () => {
    if (userActive.id != undefined && userActive.name != undefined) {
      return `<img src="/uploads/${userActive.name}_avatar.jpg" alt="" class="avatar__img" />`;
    }
    return `<img src="/uploads/default.jpg" alt="" class="avatar__img" />`;
  },
  calTotals: (totals) => {
    return totals + 24;
  },
  showOptionsAdmin: () => {
    if (userActive.admin == true) {
      return `<a href='/admin/allusers'>
      <i class='bx bxs-user-detail'></i>
        <li>List users</li>
      </a>`;
    }
    return "";
  },
  showAmountCart: (amount) => {
    if (amount > 0) {
      return `<span class="amount__cart__user">${amount}</span>`;
    }
    return "";
  },
};
module.exports = helper;
