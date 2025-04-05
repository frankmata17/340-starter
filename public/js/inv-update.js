const form = document.querySelector("#updateForm");
if (form) {
  const updateBtn = document.querySelector("button[type='submit']");
  if (updateBtn) updateBtn.setAttribute("disabled", true);

  form.addEventListener("change", function () {
    if (updateBtn) updateBtn.removeAttribute("disabled");
  });
}
