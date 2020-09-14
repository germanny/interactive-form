document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[name='registrationForm']");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("mail");
  const title = document.getElementById("title");
  const otherTitle = document.getElementById("other-title");
  const activitiesSection = document.querySelector(".activities");
  const activitiesCheckboxes = activitiesSection.querySelectorAll("input[type='checkbox']");

  const paymentSelect = document.getElementById("payment");
  const paymentCreditCard = document.getElementById("credit-card");
  const paymentPayPal = document.getElementById("paypal");
  const paymentBitcoin = document.getElementById("bitcoin");

  const ccNum = document.getElementById("cc-num");
  const ccZip = document.getElementById("zip");
  const ccCvv = document.getElementById("cvv");

  let totalCost = 0;

  /*
   * Focus on Name input
   */
  nameInput.focus();

  /*
   * Job Role
   */
  // Hide "#other-title" field on page load
  otherTitle.style.display = "none";

  // Show otherTitle if "Job Role".value === other
  title.addEventListener("change", (e) => {
    if (e.target.value === "other") {
      otherTitle.style.display = "";
    }
  });

  /*
   * T-shirt section
   */
  const designSelect = document.getElementById("design");
  const shirtColors = document.getElementById("shirt-colors");
  const shirtColorsLabel = shirtColors.querySelector("label");
  const shirtColorsSelect = document.getElementById("color");

  // Reset the label
  shirtColorsLabel.textContent = "Please select a T-Shirt theme.";

  // Hide all options on page load
  for (let i = 0; i < shirtColorsSelect.options.length; i++) {
    shirtColorsSelect.options[i].setAttribute("hidden", "");
  }

  // set the t-shirt select field on "design" select field change
  designSelect.addEventListener("change", (e) => {
    const isSelected = e.target.value === 'heart js' ? 3 : (e.target.value === 'Select Theme') ? 0 : 1;

    for (let i = 0; i < shirtColorsSelect.options.length; i++) {
      setTshirtThemeOptions(e.target.value, shirtColorsSelect.options[i]);
      shirtColorsSelect.options[i].selected = i === isSelected;
    }
  });

  /*
   * Activity section
   */

  // Total Cost element
  const activitiesTotal = document.createElement("div");
  const activitiesTotalLabel = document.createElement("strong");
  activitiesTotalLabel.textContent = "Total: $";
  const activitiesTotalSpan = document.createElement("span");

  // Only append if activitiesTotalSpan has a value
  activitiesTotal.appendChild(activitiesTotalLabel);
  activitiesTotal.appendChild(activitiesTotalSpan);
  activitiesSection.appendChild(activitiesTotal);


  // When checkbox is clicked
  activitiesSection.addEventListener('click', (e) => {
    if (e.target.tagName === "INPUT") {
      // if checked, get and accumulate cost
      totalCost += e.target.checked ?
        parseInt(e.target.dataset.cost) :
        parseInt(e.target.dataset.cost) * -1;
      activitiesTotalSpan.textContent = totalCost;

      // data-day-and-time
      // Disable options at same day/time
      for (let i = 0; i < activitiesCheckboxes.length; i++) {
        if (
          e.target.dataset.dayAndTime === activitiesCheckboxes[i].dataset.dayAndTime &&
          e.target.name !== activitiesCheckboxes[i].name
        ) {
          activitiesCheckboxes[i].disabled = !activitiesCheckboxes[i].disabled;
        }
      }
    }
  });

  /*
   * Credit Card Payment
   */

  // hide paypal, bitcoin divs
  paymentPayPal.classList.add('is-hidden');
  paymentBitcoin.classList.add('is-hidden');

  const paymentOptionsArray = [
    paymentCreditCard,
    paymentPayPal,
    paymentBitcoin,
  ];

  // show/hide payment info on select change
  paymentSelect.addEventListener("change", (e) => {
    const selection = e.target.value.replace(' ', '-');
    const selectedPaymentDiv = document.getElementById(selection);
    let i = 0;

    do {
      if (paymentOptionsArray[i].tagName === "DIV") {
        paymentOptionsArray[i].classList.add('is-hidden');
      }
      i++;
    } while (i < paymentOptionsArray.length);

    selectedPaymentDiv.classList.remove("is-hidden");
  });

  /*
   * Form Validation
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Payment section -
    if (paymentSelect.value === "credit card") {
      // CVV (if CC is select value, is 3 digits)
      isValidCVV(ccCvv);
      // Zip code (if CC is select value, is 5 digits)
      isValidZipCode(ccZip);
      // Credit Card Number (if CC is select value, is between 13-16 digits)
      isValidCcNumber(ccNum);
    }

    // Activity section - if no checkboxes selected, highlight the title
    hasSelectedActivity(activitiesSection, activitiesCheckboxes);

    // Email - if field is empty or not a valid email
    isValidEmail(emailInput);

    // Name - if field is empty
    isNotEmptyField(nameInput);

  });


  /*
   * HELPER FUNCTIONS
   */
  function setTshirtThemeOptions(theme, option) {
    // convert that damn heart icon
    const substring = option.textContent.slice(-16);
    const optionText = substring.codePointAt(0) === 9829 ?
      'heart js' :
      option.textContent.toLowerCase();

    // show or hide options based on theme
    if (optionText.indexOf(theme) > -1) {
      option.removeAttribute("hidden");
    } else {
      option.setAttribute("hidden", "");
    }
  }

  function setInvalidFieldStyles(field, valid) {
    const label = field.previousElementSibling;

    // clear error messages
    label.classList.remove('invalid');

    if (!valid) {
      field.focus();
      label.classList.add('invalid');
    }

    return field;
  }

  function isNotEmptyField(field) {
    const valid = (field.value !== "") ? true : false;
    setInvalidFieldStyles(field, valid);

    if (!field.value) {
      return false;
    }

    return true;
  }

  function isValidEmail(email) {
    const valid = /^[^@]+@[^@.]+\.[a-z]+$/.test(email.value);
    setInvalidFieldStyles(email, valid);

    if (!valid) {
      return false;
    }

    return true;
  }

  function isValidCcNumber(ccNumber) {
    const valid = /^\d{13,16}$/.test(ccNumber.value);
    setInvalidFieldStyles(ccNumber, valid);

    if (!valid) {
      return false;
    }

    return true;
  }

  function isValidZipCode(zipcode) {
    const valid = /^\d{5}(-\d{4})*$/.test(zipcode.value);
    setInvalidFieldStyles(zipcode, valid);

    if (!valid) {
      return false;
    }

    return true;
  }

  function isValidCVV(cvv) {
    const valid = /^\d{3}$/.test(cvv.value);
    setInvalidFieldStyles(cvv, valid);

    if (!valid) {
      return false;
    }

    return true;
  }

  function hasSelectedActivity(activitiesSection, activities) {
    let valid = false;
    const label = activitiesSection.querySelector("legend");
    label.classList.add('invalid');

    for (let i = 0; i < activities.length; i++) {
      if (activities[i].checked) {
        label.classList.remove('invalid');
        valid = true;
        break;
      }
    }

    if (!valid) {
      return false;
    }

    return true;
  }
});
