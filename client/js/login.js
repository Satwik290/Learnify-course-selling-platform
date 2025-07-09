
    const loginForm = document.getElementById('loginForm');
    const errorBox = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      if (!email || !password) {
        errorBox.textContent = 'All fields are required.';
        errorBox.classList.add('show');
        return;
      }

      try {
        // Replace this with actual fetch request
        // const res = await fetch("/api/login", { method: "POST", ... })
        await new Promise((res) => setTimeout(res, 1000)); // Simulate
        alert('Logged in successfully!');
        // Redirect logic goes here
      } catch (err) {
        errorBox.textContent = 'Login failed. Please try again.';
        errorBox.classList.add('show');
      }
    });
