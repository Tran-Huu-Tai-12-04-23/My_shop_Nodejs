$(window).ready(function () {
  const iconPre = $(".icon__p");
  const iconNext = $(".icon__n");
  const countProcut = $(".count__product");
  const btnAddCart = $(".button__add__cart");
  const formAddCart = $(".form__add__cart");
  var count = 1;
  countProcut.text(count);
  iconPre.click(function () {
    count--;
    if (count <= 0) {
      count = 1;
    }
    countProcut.text(count);
  });
  iconNext.click(function () {
    count++;
    countProcut.text(count);
  });
  btnAddCart.click(function (e) {
    e.preventDefault();
    var idProduct = $(this).data("id");
    formAddCart.attr("action", `/user/cart/store/${idProduct}?_method=PUT`);
    formAddCart.submit();
  });
});
