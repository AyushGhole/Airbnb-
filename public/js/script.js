() => {
  "use strict";

  //Fectb all the forms we want to apply custom bootastrap validations styles to

  const forms = document.querySelectorAll(".needs-validation");

  //Loop over them and prevents submission

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
};
