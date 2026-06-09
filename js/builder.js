// ========================
// 1. LOAD DOM ELEMENTS
// ========================
const nameInput = document.getElementById("name");
const titleInput = document.getElementById("title");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const summaryInput = document.getElementById("summary");
const educationInput = document.getElementById("education");
const experienceInput = document.getElementById("experience");
const projectInput = document.getElementById("project");
const skillsInput = document.getElementById("skills");
const imageInput = document.getElementById("profileImage");
const showPhotoCheckbox = document.getElementById("showPhoto");

// Preview Elements
const previewName = document.getElementById("previewName");
const previewTitle = document.getElementById("previewTitle");
const previewEmail = document.getElementById("previewEmail");
const previewPhone = document.getElementById("previewPhone");
const previewSummary = document.getElementById("previewSummary");
const previewEducation = document.getElementById("previewEducation");
const previewExperience = document.getElementById("previewExperience");
const previewProjects = document.getElementById("previewProjects");
const previewSkills = document.getElementById("previewSkills");
const previewImage = document.getElementById("previewImage");

// ========================
// 2. CORE FUNCTIONS
// ========================
function saveResume() {
    const data = {
        name: nameInput.value,
        title: titleInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        summary: summaryInput.value,
        education: educationInput.value,
        experience: experienceInput.value,
        project: projectInput.value,
        skills: skillsInput.value
    };
    localStorage.setItem("resumeData", JSON.stringify(data));
    updatePreview();
}

function updatePreview() {
    const data = JSON.parse(localStorage.getItem("resumeData"));
    if (!data) return;

    if (previewName) previewName.textContent = data.name || "Your Name";
    if (previewTitle) previewTitle.textContent = data.title || "Professional Title";
    if (previewEmail) previewEmail.textContent = data.email || "Email";
    if (previewPhone) previewPhone.textContent = data.phone || "Phone";
    if (previewSummary) previewSummary.textContent = data.summary || "";
    if (previewEducation) previewEducation.textContent = data.education || "";
    if (previewExperience) previewExperience.textContent = data.experience || "";
    if (previewProjects) previewProjects.textContent = data.project || "";
    if (previewSkills) previewSkills.textContent = data.skills || "";
}

function toggleProfilePhoto() {
    if (!previewImage || !showPhotoCheckbox) return;
    previewImage.style.display = showPhotoCheckbox.checked ? "" : "none";
}

function selectTemplate(name) {
    localStorage.setItem("selectedTemplate", name);
    const resume = document.getElementById("resume-preview");
    if (resume) {
        resume.className = "";
        resume.classList.add(name);
    }
}

function saveHistory() {
    const history = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    history.unshift({
        template: localStorage.getItem("selectedTemplate") || "Professional",
        date: new Date().toLocaleString()
    });
    localStorage.setItem("resumeHistory", JSON.stringify(history));
}

// ========================
// 3. EVENT LISTENERS
// ========================
// Auto-Save Inputs
document.querySelectorAll(".left-panel input[type='text'], .left-panel input[type='email'], .left-panel textarea").forEach(input => {
    input.addEventListener("input", saveResume);
});

// Profile Photo Upload (WITH CANVAS COMPRESSION FIX)
if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            // 1. Create an off-screen image to read the uploaded file
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // 2. Create a temporary canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // 3. Set a maximum size for the profile photo (300px is plenty for a resume)
                const MAX_SIZE = 300;
                let width = img.width;
                let height = img.height;

                // 4. Calculate the new dimensions while keeping the aspect ratio perfect
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 5. Draw the shrunken image onto the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // 6. Compress it into a lightweight JPEG (70% quality)
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

                // 7. Update the UI with the compressed image
                if (previewImage) previewImage.src = compressedBase64;
                const navProfilePic = document.getElementById("navProfilePic");
                if (navProfilePic) navProfilePic.src = compressedBase64;

                // 8. Safely save the tiny image to localStorage without crashing!
                try {
                    localStorage.setItem("profileImage", compressedBase64);
                } catch (error) {
                    console.error("Storage error:", error);
                    alert("Your browser's local storage is completely full. Please clear your cache.");
                }
            };
        };
        reader.readAsDataURL(file);
    });
}
// ========================
// 4. BOOT UP ON PAGE LOAD
// ========================
function loadResume() {
    const data = JSON.parse(localStorage.getItem("resumeData"));
    if (!data) return;

    if (nameInput) nameInput.value = data.name || "";
    if (titleInput) titleInput.value = data.title || "";
    if (emailInput) emailInput.value = data.email || "";
    if (phoneInput) phoneInput.value = data.phone || "";
    if (summaryInput) summaryInput.value = data.summary || "";
    if (educationInput) educationInput.value = data.education || "";
    if (experienceInput) experienceInput.value = data.experience || "";
    if (projectInput) projectInput.value = data.project || "";
    if (skillsInput) skillsInput.value = data.skills || "";
}

document.addEventListener("DOMContentLoaded", () => {
    loadResume();
    updatePreview();

    // Load Checkbox state
    const savedShowPhoto = localStorage.getItem("showPhoto");
    if (savedShowPhoto !== null && showPhotoCheckbox) {
        showPhotoCheckbox.checked = savedShowPhoto === "true";
    }
    toggleProfilePhoto();

    // Load Profile Image
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage && previewImage) {
        previewImage.src = savedImage;
    }

    // Load Selected Template
    const selectedTemplate = localStorage.getItem("selectedTemplate");
    const resumePreview = document.getElementById("resume-preview");
    if (selectedTemplate && resumePreview) {
        resumePreview.className = "";
        resumePreview.classList.add(selectedTemplate);
    }
});