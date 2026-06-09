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

// Toggles & Export
const showPhotoCheckbox = document.getElementById("showPhoto");
const showExperienceCheckbox = document.getElementById("showExperience");
const showProjectCheckbox = document.getElementById("showProject");
const exportDataBtn = document.getElementById("exportDataBtn");

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

// Section Containers
const experienceSection = document.getElementById("experienceSection");
const projectSection = document.getElementById("projectSection");

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
// 3. TOGGLE VISIBILITY FUNCTIONS
// ========================
function toggleProfilePhoto() {
    if (!previewImage || !showPhotoCheckbox) return;
    previewImage.style.display = showPhotoCheckbox.checked ? "" : "none";
}

function toggleExperience() {
    if (!experienceSection || !showExperienceCheckbox) return;
    experienceSection.style.display = showExperienceCheckbox.checked ? "" : "none";
}

function toggleProject() {
    if (!projectSection || !showProjectCheckbox) return;
    projectSection.style.display = showProjectCheckbox.checked ? "" : "none";
}

// ========================
// 4. EVENT LISTENERS
// ========================
// Auto-Save Inputs
document.querySelectorAll(".left-panel input[type='text'], .left-panel input[type='email'], .left-panel textarea").forEach(input => {
    input.addEventListener("input", saveResume);
});

// Checkbox Listeners
if (showPhotoCheckbox) {
    showPhotoCheckbox.addEventListener("change", () => {
        toggleProfilePhoto();
        localStorage.setItem("showPhoto", showPhotoCheckbox.checked);
    });
}

if (showExperienceCheckbox) {
    showExperienceCheckbox.addEventListener("change", () => {
        toggleExperience();
        localStorage.setItem("showExperience", showExperienceCheckbox.checked);
    });
}

if (showProjectCheckbox) {
    showProjectCheckbox.addEventListener("change", () => {
        toggleProject();
        localStorage.setItem("showProject", showProjectCheckbox.checked);
    });
}

// Profile Photo Upload (With Canvas Compression)
if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const MAX_SIZE = 300;
                let width = img.width;
                let height = img.height;

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
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

                if (previewImage) previewImage.src = compressedBase64;
                const navProfilePic = document.getElementById("navProfilePic");
                if (navProfilePic) navProfilePic.src = compressedBase64;

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

// Export Data to TXT File
if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
        const dataString = localStorage.getItem("resumeData");
        if (!dataString) {
            alert("No data to save yet! Type something first.");
            return;
        }

        const data = JSON.parse(dataString);
        const textContent = `
=========================================
          RESUME DATA BACKUP
=========================================

NAME: ${data.name || "N/A"}
TITLE: ${data.title || "N/A"}
EMAIL: ${data.email || "N/A"}
PHONE: ${data.phone || "N/A"}

-----------------------------------------
PROFESSIONAL SUMMARY
-----------------------------------------
${data.summary || "N/A"}

-----------------------------------------
EDUCATION
-----------------------------------------
${data.education || "N/A"}

-----------------------------------------
EXPERIENCE
-----------------------------------------
${data.experience || "N/A"}

-----------------------------------------
PROJECTS
-----------------------------------------
${data.project || "N/A"}

-----------------------------------------
SKILLS
-----------------------------------------
${data.skills || "N/A"}
        `.trim();

        const blob = new Blob([textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "My_Resume_Backup.txt";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Direct PDF Download via html2pdf
const downloadBtn = document.querySelector(".download-btn");
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "Generating PDF...";
        downloadBtn.disabled = true;

        saveHistory();

        const element = document.getElementById("resume-preview");
        const opt = {
            margin:       0, 
            filename:     'My_Professional_Resume.pdf',
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true
            },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error("PDF Error:", err);
            alert("Something went wrong generating the PDF.");
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
        });
    });
}

// ========================
// 5. BOOT UP ON PAGE LOAD
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

    // Load Checkbox states
    const savedShowPhoto = localStorage.getItem("showPhoto");
    if (savedShowPhoto !== null && showPhotoCheckbox) showPhotoCheckbox.checked = savedShowPhoto === "true";
    toggleProfilePhoto();

    const savedShowExperience = localStorage.getItem("showExperience");
    if (savedShowExperience !== null && showExperienceCheckbox) showExperienceCheckbox.checked = savedShowExperience === "true";
    toggleExperience();

    const savedShowProject = localStorage.getItem("showProject");
    if (savedShowProject !== null && showProjectCheckbox) showProjectCheckbox.checked = savedShowProject === "true";
    toggleProject();

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
