function validation(form) {
  const getTextValidate = function (input) {
    return input.parentElement;
  };
  var formRules = {};
  var isError = false;
  var isSubmit = 0;
  const rulesValidate = {
    required: (val, nameInput) => {
      return val === ""
        ? [`Please, enter ${nameInput}`, true, "error", "success"]
        : ["Correct!!!", false, "success", "error"];
    },
    pass: (val1, nameInput) => {
      var val2 = formValidation.querySelector('input[name="password"]').value;
      var val3 = formValidation.querySelector(
        'input[name="confirmpassword"]'
      ).value;
      return val2 === val3 || val3 === "" || val2 === ""
        ? ["Correct!!!", false, "success", "error"]
        : [`${nameInput} Incorrect!!!`, true, "error", "success"];
    },
    min: (valmin) => {
      return (val, nameInput) => {
        return val.length < valmin
          ? [
              `${nameInput} must enter a least ${valmin} characters!!!`,
              true,
              "error",
              "success",
            ]
          : ["Correct!!!", false, "success", "error"];
      };
    },
  };
  var formValidation = document.querySelector(form);

  if (formValidation) {
    var inputs = formValidation.querySelectorAll("[name][rules]");
    for (var input of inputs) {
      var nameInput = input.name;
      var listRules = input.getAttribute("rules").split("|");
      var ruleFuction;
      for (var rule of listRules) {
        if (rule.includes(":")) {
          var ruleDetail = rule.split(":");
          rule = ruleDetail[0];
          ruleFuction = rulesValidate[rule](ruleDetail[1]);
        } else {
          ruleFuction = rulesValidate[rule];
        }
        if (Array.isArray(formRules[nameInput])) {
          formRules[nameInput].push(ruleFuction);
        } else {
          formRules[nameInput] = [ruleFuction];
        }
      }
      input.onblur = handleValidate;
      // input.onkeyup = handleValidate;
    }
    var buttonSubmitForm = formValidation.querySelector("button");
    buttonSubmitForm.onclick = function (e) {
      isSubmit = 0;
      for (var input of inputs) {
        handleValidate({
          target: input,
        });
      }
      if (isSubmit >= 1) {
        e.preventDefault();
      }
    };

    function handleValidate(event) {
      var rules = formRules[event.target.name];
      var textValidate = getTextValidate(event.target).querySelector(
        ".show__validation"
      );
      isError = false;
      for (var rule of rules) {
        if (isError == false) {
          var nameInput = event.target.name;
          var val = event.target.value;
          var infoValidate = rule(val, nameInput);
          handleError(textValidate, infoValidate);
        }
      }
    }
    function handleError(textValidate, infoValidate) {
      // console.log(infoValidate);
      isError = infoValidate[1];
      if (infoValidate[1] == true) {
        isSubmit++;
      }
      textValidate.innerText = infoValidate[0];
      textValidate.classList.remove("hidden");
      textValidate.classList.add(infoValidate[2]);
      textValidate.classList.remove(infoValidate[3]);
    }
  }
}
