// ========================
// NAVIGATION & TEMPLATE SELECTION
// ========================

// Saves the template and redirects to the builder
// Saves the template and redirects OR updates live preview
function selectTemplate(templateName) {
    localStorage.setItem("selectedTemplate", templateName);
    
    const previewContainer = document.getElementById("resume-preview");
    if (previewContainer) {
        // If we are on the builder page, update live!
        previewContainer.className = "";
        previewContainer.classList.add(templateName);
    } else {
        // If we are on the home page, redirect to builder!
        window.location.href = "builder.html";
    }
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
// THEME LOGIC (SAFE VERSION)
// ========================
(function() {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Apply saved theme immediately on load
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme === "light") {
        body.classList.add("light");
        if (themeToggle) themeToggle.checked = true;
    }

    // Only add listener if the toggle exists on this page
    if (themeToggle) {
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
})();

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
