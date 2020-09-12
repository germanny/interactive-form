document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[name='registrationForm']");

  /*
   * Focus on Name input
   */
  form.querySelector("#name").focus();

  /*
   * #other-title
   */
  // Hide "#other-title" field on page load
  const otherTitle = form.querySelector("#other-title");
  otherTitle.style.display = "none";

  /*
   * T-shirt section
   */
  const designSelect = form.querySelector("#design");
  const shirtColors = form.querySelector("#shirt-colors");
  const shirtColorsLabel = shirtColors.querySelector("label");
  const shirtColorsSelect = shirtColors.querySelector("select");

  // Reset the label
  shirtColorsLabel.textContent = "Please select a T-Shirt theme.";

  // Hide all options on page load
  for (let i = 0; i < shirtColorsSelect.options.length; i++) {
    shirtColorsSelect.options[i].setAttribute("hidden", "");
  }

  designSelect.addEventListener("change", (e) => {
    const isSelected = e.target.value === 'heart js' ? 3 : 0;
    console.log(isSelected);
    for (let i = 0; i < shirtColorsSelect.options.length; i++) {
      setTshirtThemeOptions(e.target.value, shirtColorsSelect.options[i]);
      shirtColorsSelect.options[i].selected = i === isSelected;
    }
  });

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
});
