document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/user/me", {
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      window.location.href = "../auth/login.html";
      return;
    }

    const role = data.user.role;

    if (role === "instructor") {
      window.location.href = "instructor.html";
    } else {
      window.location.href = "student.html";
    }
  } catch (err) {
    console.error("Dashboard redirect error:", err);
    window.location.href = "../auth/login.html";
  }
});
