document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value;
    const lastName = document.getElementById("lastName")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const age = parseInt(document.getElementById("age")?.value);
    const gender = document.getElementById("gender")?.value;
    const photoUrl = document.getElementById("photoUrl")?.value;
    const terms = document.getElementById("terms")?.checked;

    const roleInput = document.querySelector('input[name="role"]:checked');
    const role = roleInput ? roleInput.value : "student";

    const errorBox = document.getElementById("errorAlert");
    const successBox = document.getElementById("successAlert");

    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (password !== confirmPassword) {
      errorBox.textContent = "Passwords do not match!";
      errorBox.style.display = "block";
      return;
    }

    if (!terms) {
      errorBox.textContent = "You must agree to the terms and privacy policy.";
      errorBox.style.display = "block";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          age,
          gender,
          photoUrl,
          role
        }),
        credentials: "include"
      });

      const data = await res.json();

     if (!res.ok) {
    // Properly extract error message
    let errorMessage = "Something went wrong!";
    if (typeof data.error === "string") {
      errorMessage = data.error;
    } else if (typeof data.error === "object" && data.error !== null) {
      errorMessage = Object.values(data.error).join(" | ");
    } else if (data.message) {
      errorMessage = data.message;
    }

    errorBox.textContent = errorMessage;
    errorBox.style.display = "block";
  } else {
    successBox.textContent = "Signup successful! Redirecting to login...";
    successBox.style.display = "block";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  }
} catch (err) {
  console.error("Signup error:", err);
  errorBox.textContent = "Network error. Please try again.";
  errorBox.style.display = "block";
  }
  });
});
