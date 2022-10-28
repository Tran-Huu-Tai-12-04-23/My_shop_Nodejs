$(document).ready(function () {
  const btnRestore = $(".btn__restore");
  const btnForceDelete = $(".btn__force__delete");
  const formRestore = $(".form__restore__product");
  const btnCloseModal = $(".btn__close__modal");
  const btnForceDeleteModal = $(".btn__force__delete__modal");
  const formDelete = $(".form__delete");

  console.log(btnForceDeleteModal);

  btnRestore.click(function () {
    const idproduct = $(this).data("id");
    formRestore.attr(
      "action",
      `/user/product/restore/${idproduct}?_method=PUT`
    );
    formRestore.submit();
  });

  btnForceDelete.click(function () {
    $("#modal").removeClass("hidden");
    btnForceDeleteModal.attr("data-id", $(this).data("id"));
  });

  btnCloseModal.click(function () {
    $("#modal").addClass("hidden");
  });

  btnForceDeleteModal.click(function () {
    const idproductDelete = $(this).data("id");
    console.log(idproductDelete);
    formDelete.attr(
      "action",
      `
        /user/product/destroy/${idproductDelete}?_method=DELETE `
    );
    formDelete.submit();
  });
});
