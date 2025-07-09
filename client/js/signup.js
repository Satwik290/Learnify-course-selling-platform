
    const signupForm = document.getElementById("signupForm");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");
    const errorAlert = document.getElementById("errorAlert");
    const successAlert = document.getElementById("successAlert");

    const getStrength = (pwd) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    };

    password.addEventListener("input", () => {
      const score = getStrength(password.value);
      const percent = (score / 5) * 100;
      strengthFill.style.width = percent + "%";
      if (score < 3) {
        strengthFill.style.background = "red";
        strengthText.textContent = "Weak";
      } else if (score < 5) {
        strengthFill.style.background = "orange";
        strengthText.textContent = "Medium";
      } else {
        strengthFill.style.background = "green";
        strengthText.textContent = "Strong";
      }
    });

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorAlert.textContent = "";
      successAlert.textContent = "";

      if (password.value !== confirmPassword.value) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match!";
        return;
      }

      const formData = {
        firstName: signupForm.firstName.value.trim(),
        lastName: signupForm.lastName.value.trim(),
        email: signupForm.email.value.trim(),
        password: signupForm.password.value,
        age: parseInt(signupForm.age.value),
        gender: signupForm.gender.value,
        photoUrl: signupForm.photoUrl.value,
        role: signupForm.role.value,
      };

      try {
        const res = await fetch("https://your-backend-api.com/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        successAlert.textContent = "🎉 Signup successful!";
        successAlert.classList.add("show");
        setTimeout(() => (window.location.href = "login.html"), 2000);
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.classList.add("show");
      }
    });
