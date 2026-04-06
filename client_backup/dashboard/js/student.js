document.addEventListener("DOMContentLoaded", async () => {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const coursesContainer = document.getElementById("coursesContainer");

  try {
    const res = await fetch("http://localhost:5000/api/user/me", {
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Session expired. Redirecting...");
      return window.location.href = "../auth/login.html";
    }

    const { firstName, lastName, email, enrolledCourses } = data.user;

    nameEl.textContent = `${firstName} ${lastName}`;
    emailEl.textContent = email;

    if (enrolledCourses && enrolledCourses.length) {
      enrolledCourses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "course-card";
        courseCard.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description?.slice(0, 100)}...</p>
        `;
        coursesContainer.appendChild(courseCard);
      });
    } else {
      coursesContainer.innerHTML = `<p>No courses enrolled yet.</p>`;
    }

  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Something went wrong. Try again later.");
  }

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "../auth/login.html";
  });
});
