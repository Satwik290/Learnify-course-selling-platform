document.addEventListener("DOMContentLoaded", async () => {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const coursesContainer = document.getElementById("coursesContainer");

  try {
    const res = await fetch("http://localhost:5000/api/user/me", {
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok || data.user.role !== "instructor") {
      alert("Unauthorized. Redirecting...");
      return window.location.href = "../auth/login.html";
    }

    const { firstName, lastName, email, createdCourses = [] } = data.user;

    nameEl.textContent = `${firstName} ${lastName}`;
    emailEl.textContent = email;

    if (createdCourses.length) {
      createdCourses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "course-card";
        courseCard.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description?.slice(0, 100)}...</p>
          <p><strong>Enrolled:</strong> ${course.students?.length || 0}</p>
        `;
        coursesContainer.appendChild(courseCard);
      });
    } else {
      coursesContainer.innerHTML = `<p>You haven’t created any courses yet.</p>`;
    }

  } catch (err) {
    console.error("Instructor Dashboard Error:", err);
    alert("Something went wrong.");
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "../auth/login.html";
  });
});
