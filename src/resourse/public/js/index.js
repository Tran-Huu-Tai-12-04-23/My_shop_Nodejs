$(window).ready(function () {
  const inputSearch = $('input[type="search"]');
  const menuUser = $(".menu__user");
  const iconActive = $(".icon__active");
  const iconClose = $(".icon__close");

  inputSearch.focus(function () {
    $(".icon__search").css("display", "none");
    $(".input__search").css("margin-left", "0");
  });

  inputSearch.blur(function () {
    if (inputSearch.val() == "") {
      $(".input__search").css("margin-left", "12px");
      $(".icon__search").css("display", "block");
    }
  });

  var isOpenMenu = false;
  iconActive.click(function (e) {
    e.stopPropagation();
    isOpenMenu = !isOpenMenu;
    handleMenu(isOpenMenu);
  });
  iconClose.click(function (e) {
    e.stopPropagation();
    menuUser.removeClass("show");
    isOpenMenu = !isOpenMenu;
  });
  function handleMenu(isOpenMenu) {
    if (isOpenMenu == true) {
      menuUser.addClass("show");
    } else if (isOpenMenu == false) {
      menuUser.removeClass("show");
    }
  }

  $(window).click(function () {
    isOpenMenu = !isOpenMenu;
    menuUser.removeClass("show");
  });

  const iconPrev = $(".icon__pre");
  const iconNext = $(".icon__next");
  const listNavImg = $(".nav__img").children();

  iconPrev.click(function () {
    translateImg("-");
  });
  iconNext.click(function () {
    translateImg("+");
  });

  function translateImg(drChange) {
    const listImg = document.querySelectorAll(".slider__img");
    const lengthList = listImg.length;
    switch (drChange) {
      case "-":
        document
          .querySelector(".wrap__slider__list")
          .prepend(listImg[lengthList - 1]);
        break;
      case "+":
        document.querySelector(".wrap__slider__list").appendChild(listImg[0]);
        break;
    }
  }

  const listItemNavContent = $(".content__navigation").children().children();
  const iconShowPass = $(".show__pass");
  const iconHiddenPass = $(".hidden__pass");

  listItemNavContent.click(function () {
    listItemNavContent.removeClass("active_nav");
    $(this).addClass("active_nav");
  });

  const inputFormLogin = $(".input__form");
  inputFormLogin.blur(function () {
    if ($(this).val() != "") {
      $(this)
        .parent()
        .children(".icon__form")
        .css("transform", "translate(-10px, -250%)");
    } else {
      $(this)
        .parent()
        .children(".icon__form")
        .css("transform", "translateY(-50%)");
    }
  });
  inputFormLogin.focus(function () {
    $(this)
      .parent()
      .children(".icon__form")
      .css("transform", "translate(-10px, -250%)");
  });

  inputFormLogin.keyup(function () {
    if ($(this).val() != "") {
      $(this)
        .parent()
        .children(".icon__pass")
        .children(".hidden__pass")
        .addClass("show");
    } else {
      $(this)
        .parent()
        .children(".icon__pass")
        .children(".hidden__pass")
        .removeClass("show");
    }
  });

  iconShowPass.click(function () {
    $(this).parent().children(".hidden__pass").addClass("show");
    $(this).removeClass("show");
    $(this).parent().parent().children("input").attr("type", "password");
  });
  iconHiddenPass.click(function () {
    $(this).parent().children(".show__pass").addClass("show");
    $(this).removeClass("show");
    $(this).parent().parent().children("input").attr("type", "text");
  });

  const buttonRegister = $(".button__register");
  const buttonlogin = $(".button__login");
  buttonRegister.click(function (e) {
    e.preventDefault();
    showFormOptions(buttonRegister);
  });
  buttonlogin.click(function (e) {
    e.preventDefault();
    showFormOptions(buttonlogin);
  });

  function showFormOptions(element) {
    $(".form__create.form__login.hidden").removeClass("hidden");
    element.parent().parent().addClass("hidden");
  }
});
