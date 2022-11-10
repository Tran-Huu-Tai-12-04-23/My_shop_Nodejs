$(window).ready(function () {
  const iconPre = $(".icon__p");
  const iconNext = $(".icon__n");
  const countProcut = $(".count__product");
  const btnAddCart = $(".button__add__cart");
  const formAddCart = $(".form__add__cart");
  const formAction = $(".form__action");
  const iconRemove = $(".icon__remove");

  iconPre.click(function (e) {
    e.preventDefault();
    var idProduct = $(this).data("id");
    formAction.attr(
      "action",
      `/user/cart/store/delete/${idProduct}?_method=DELETE`
    );
    formAction.submit();
  });
  iconNext.click(function (e) {
    e.preventDefault();
    var idProduct = $(this).data("id");
    formAction.attr("action", `/user/cart/store/${idProduct}?_method=PUT`);
    formAction.submit();
  });
  btnAddCart.click(function (e) {
    var amount = $('.count__product').text();
    e.preventDefault();
    var idProduct = $(this).data("id");
    formAddCart.attr("action", `/user/cart/store/${idProduct}/${amount}?_method=PUT`);
    formAddCart.submit();
  });

  iconRemove.click(function () {
    const idProduct = $(this).data("id");
    formAction.attr(
      "action",
      `/user/cart/store/destroy/${idProduct}?_method=DELETE`
    );

    formAction.submit();
  });
});
