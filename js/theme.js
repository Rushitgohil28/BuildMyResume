// ========================
// NAVIGATION & TEMPLATE SELECTION
// ========================

// Saves the template and redirects to the builder
function selectTemplate(templateName) {
    localStorage.setItem("selectedTemplate", templateName);
    window.location.href = "builder.html";
}

// "Start Building" Button -> Goes directly to builder
const startBtn = document.querySelector(".primary-btn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        window.location.href = "builder.html";
    });
}

// "Explore Templates" Button -> Scrolls down to the grid
const exploreBtn = document.querySelector(".secondary-btn");
if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
        const templatesSection = document.getElementById("templates");
        if (templatesSection) templatesSection.scrollIntoView({ behavior: "smooth" });
    });
}

// ========================
// THEME TOGGLE (DARK/LIGHT MODE)
// ========================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
    // Check local storage for saved theme on page load
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme === "light") {
        body.classList.add("light");
        themeToggle.checked = true;
    }

    // Listen for toggle clicks
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            body.classList.add("light");
            localStorage.setItem("appTheme", "light");
        } else {
            body.classList.remove("light");
            localStorage.setItem("appTheme", "dark");
        }
    });
}

// ========================
// MOBILE HAMBURGER MENU
// ========================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    // Toggle menu on tap
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close the menu automatically if the user clicks a link (like 'Templates')
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });
}

// ========================
// LOAD PROFILE PIC IN NAVBAR
// ========================
// Automatically fetches the image the user uploaded in the builder
const navProfilePic = document.getElementById("navProfilePic");
const savedProfilePic = localStorage.getItem("profileImage");

if (navProfilePic && savedProfilePic) {
    navProfilePic.src = savedProfilePic;
}