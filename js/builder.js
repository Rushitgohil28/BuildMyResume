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

// Custom Extra Section Elements
const customTitleInput = document.getElementById("customTitle");
const customContentInput = document.getElementById("customContent");
const showCustomCheckbox = document.getElementById("showCustom");

// Toggles & Export
const showPhotoCheckbox = document.getElementById("showPhoto");
const showExperienceCheckbox = document.getElementById("showExperience");
const showProjectCheckbox = document.getElementById("showProject");
const showNewspaperCheckbox = document.getElementById("showNewspaper"); // Newspaper Toggle
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
const previewCustomTitle = document.getElementById("previewCustomTitle");
const previewCustomContent = document.getElementById("previewCustomContent");
const previewImage = document.getElementById("previewImage");

// Section Containers
const experienceSection = document.getElementById("experienceSection");
const projectSection = document.getElementById("projectSection");
const customSection = document.getElementById("customSection");
const previewContainer = document.getElementById("resume-preview");
const resumeBody = document.getElementById("resume-body"); // Newspaper Body

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
        skills: skillsInput.value,
        customTitle: customTitleInput.value,
        customContent: customContentInput.value
    };
    localStorage.setItem("resumeData", JSON.stringify(data));
    updatePreview();
}

function updatePreview() {
    const data = JSON.parse(localStorage.getItem("resumeData"));
    if (!data) return;

    // Checks active element so the cursor doesn't reset when live-editing
    if (previewName && document.activeElement !== previewName) previewName.textContent = data.name || "Your Name";
    if (previewTitle && document.activeElement !== previewTitle) previewTitle.textContent = data.title || "Professional Title";
    if (previewEmail && document.activeElement !== previewEmail) previewEmail.textContent = data.email || "Email";
    if (previewPhone && document.activeElement !== previewPhone) previewPhone.textContent = data.phone || "Phone";
    if (previewSummary && document.activeElement !== previewSummary) previewSummary.textContent = data.summary || "";
    if (previewEducation && document.activeElement !== previewEducation) previewEducation.textContent = data.education || "";
    if (previewExperience && document.activeElement !== previewExperience) previewExperience.textContent = data.experience || "";
    if (previewProjects && document.activeElement !== previewProjects) previewProjects.textContent = data.project || "";
    if (previewSkills && document.activeElement !== previewSkills) previewSkills.textContent = data.skills || "";
    if (previewCustomTitle && document.activeElement !== previewCustomTitle) previewCustomTitle.textContent = data.customTitle || "Extra Section";
    if (previewCustomContent && document.activeElement !== previewCustomContent) previewCustomContent.textContent = data.customContent || "";
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

function toggleCustom() {
    if (!customSection || !showCustomCheckbox) return;
    customSection.style.display = showCustomCheckbox.checked ? "" : "none";
}

// ========================
// 4. EVENT LISTENERS
// ========================
// Auto-Save Inputs
document.querySelectorAll(".left-panel input[type='text'], .left-panel input[type='email'], .left-panel textarea").forEach(input => {
    input.addEventListener("input", saveResume);
});

// Live Edit Synchronization (PDF directly edited syncs back to left panel)
const editableElements = [
    { preview: previewName, input: nameInput, key: 'name' },
    { preview: previewTitle, input: titleInput, key: 'title' },
    { preview: previewEmail, input: emailInput, key: 'email' },
    { preview: previewPhone, input: phoneInput, key: 'phone' },
    { preview: previewSummary, input: summaryInput, key: 'summary' },
    { preview: previewEducation, input: educationInput, key: 'education' },
    { preview: previewExperience, input: experienceInput, key: 'experience' },
    { preview: previewProjects, input: projectInput, key: 'project' },
    { preview: previewSkills, input: skillsInput, key: 'skills' },
    { preview: previewCustomTitle, input: customTitleInput, key: 'customTitle' },
    { preview: previewCustomContent, input: customContentInput, key: 'customContent' }
];

editableElements.forEach(item => {
    if (item.preview) {
        item.preview.addEventListener("input", () => {
            if (item.input) item.input.value = item.preview.innerText;
            const data = JSON.parse(localStorage.getItem("resumeData")) || {};
            data[item.key] = item.preview.innerText;
            localStorage.setItem("resumeData", JSON.stringify(data));
        });
    }
});

// Drag and Drop Rearranging logic
const draggableSections = previewContainer.querySelectorAll("section[draggable='true']");
let draggedElement = null;

draggableSections.forEach(section => {
    section.addEventListener("dragstart", function(e) {
        draggedElement = this;
        this.style.opacity = "0.4";
        e.dataTransfer.effectAllowed = "move";
    });

    section.addEventListener("dragend", function(e) {
        this.style.opacity = "1";
        draggedElement = null;
        draggableSections.forEach(s => {
            s.style.borderTop = "none";
            s.style.borderBottom = "none";
        });
    });

    section.addEventListener("dragover", function(e) {
        e.preventDefault();
        if (this === draggedElement) return;
        const bounding = this.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        if (e.clientY - offset > 0) {
            this.style.borderBottom = "3px dashed #3b82f6";
            this.style.borderTop = "none";
        } else {
            this.style.borderTop = "3px dashed #3b82f6";
            this.style.borderBottom = "none";
        }
    });

    section.addEventListener("dragleave", function(e) {
        this.style.borderTop = "none";
        this.style.borderBottom = "none";
    });

    section.addEventListener("drop", function(e) {
        e.preventDefault();
        this.style.borderTop = "none";
        this.style.borderBottom = "none";
        if (this !== draggedElement) {
            const bounding = this.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            if (e.clientY - offset > 0) {
                this.parentNode.insertBefore(draggedElement, this.nextSibling);
            } else {
                this.parentNode.insertBefore(draggedElement, this);
            }
        }
    });
});

// Checkbox Listeners
if (showPhotoCheckbox) { showPhotoCheckbox.addEventListener("change", () => { toggleProfilePhoto(); localStorage.setItem("showPhoto", showPhotoCheckbox.checked); }); }
if (showExperienceCheckbox) { showExperienceCheckbox.addEventListener("change", () => { toggleExperience(); localStorage.setItem("showExperience", showExperienceCheckbox.checked); }); }
if (showProjectCheckbox) { showProjectCheckbox.addEventListener("change", () => { toggleProject(); localStorage.setItem("showProject", showProjectCheckbox.checked); }); }
if (showCustomCheckbox) { showCustomCheckbox.addEventListener("change", () => { toggleCustom(); localStorage.setItem("showCustom", showCustomCheckbox.checked); }); }

// Newspaper Layout Listener
if (showNewspaperCheckbox && resumeBody) {
    showNewspaperCheckbox.addEventListener("change", () => {
        if (showNewspaperCheckbox.checked) {
            resumeBody.classList.add("newspaper");
        } else {
            resumeBody.classList.remove("newspaper");
        }
        localStorage.setItem("showNewspaper", showNewspaperCheckbox.checked);
        if (typeof autoFitResume === "function") autoFitResume();
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
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                } else {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                if (previewImage) previewImage.src = compressedBase64;
                const navProfilePic = document.getElementById("navProfilePic");
                if (navProfilePic) navProfilePic.src = compressedBase64;

                try { localStorage.setItem("profileImage", compressedBase64); } catch (error) { console.error("Storage error:", error); alert("Your browser's local storage is completely full. Please clear your cache."); }
            };
        };
        reader.readAsDataURL(file);
    });
}

// Export Data to TXT File
if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
        const dataString = localStorage.getItem("resumeData");
        if (!dataString) { alert("No data to save yet! Type something first."); return; }

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

-----------------------------------------
${data.customTitle || "EXTRA SECTION"}
-----------------------------------------
${data.customContent || "N/A"}
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

// ========================
// PDF DOWNLOAD - VISIBLE OVERLAY FIX
// ========================
const downloadBtn = document.querySelector(".download-btn");
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "Please Wait...";
        downloadBtn.disabled = true;

        saveHistory();

        const now = new Date();
        const timestamp = now.toLocaleDateString().replace(/\//g, '-') + '_' + now.getHours() + '-' + now.getMinutes();
        const userName = (document.getElementById("name").value || "resume").trim().replace(/\s+/g, '_');
        const safeFileName = `${userName}_${timestamp}.pdf`.toLowerCase();
        const activeTemplate = localStorage.getItem("selectedTemplate") || "professional";

        // Create an overlay container ON TOP of everything
        const captureContainer = document.createElement("div");
        captureContainer.style.position = "absolute";
        captureContainer.style.top = "0";
        captureContainer.style.left = "0";
        captureContainer.style.width = "800px"; // Force desktop width
        captureContainer.style.backgroundColor = "#ffffff";
        captureContainer.style.zIndex = "999999"; 
        
        // Add a visual loading message
        const loadingMessage = document.createElement("div");
        loadingMessage.innerHTML = "<h2 style='text-align:center; padding: 40px; font-family:sans-serif; color: black;'>Generating your PDF...<br><small>Do not close this page.</small></h2>";
        captureContainer.appendChild(loadingMessage);

        // Clone the resume
        const clone = document.getElementById("resume-preview").cloneNode(true);
        clone.className = activeTemplate;
        clone.style.margin = "0";
        clone.style.transform = "none";
        clone.style.boxShadow = "none"; 
        
        captureContainer.appendChild(clone);
        document.body.appendChild(captureContainer);

        const originalScroll = window.scrollY;
        window.scrollTo(0, 0);

        const opt = {
            margin:       0,
            filename:     safeFileName,
            image:        { type: 'jpeg', quality: 0.95 },
            html2canvas:  {
                scale: 1.5, // Lower scale prevents mobile memory crashes
                useCORS: true,
                windowWidth: 800,
                width: 800,
                scrollY: 0
            },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        setTimeout(() => {
            html2pdf().set(opt).from(clone).save().then(() => {
                document.body.removeChild(captureContainer);
                window.scrollTo(0, originalScroll);
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error("PDF Error:", err);
                if(document.body.contains(captureContainer)) document.body.removeChild(captureContainer);
                window.scrollTo(0, originalScroll);
                alert("Memory error: Could not generate PDF. Try closing other tabs on your phone.");
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
            });
        }, 1000); 
    });
}

// ========================
// JPG DOWNLOAD - VISIBLE OVERLAY FIX
// ========================
const downloadJpgBtn = document.querySelector(".download-jpg-btn");
if (downloadJpgBtn) {
    downloadJpgBtn.addEventListener("click", () => {
        const originalText = downloadJpgBtn.innerText;
        downloadJpgBtn.innerText = "Please Wait...";
        downloadJpgBtn.disabled = true;

        if (typeof saveHistory === 'function') saveHistory();

        const now = new Date();
        const timestamp = now.toLocaleDateString().replace(/\//g, '-') + '_' + now.getHours() + '-' + now.getMinutes();
        const userName = (document.getElementById("name").value || "resume").trim().replace(/\s+/g, '_');
        const safeFileName = `${userName}_${timestamp}.jpg`.toLowerCase();
        const activeTemplate = localStorage.getItem("selectedTemplate") || "professional";

        // 1. Create an overlay container ON TOP of everything
        const captureContainer = document.createElement("div");
        captureContainer.style.position = "absolute";
        captureContainer.style.top = "0";
        captureContainer.style.left = "0";
        captureContainer.style.width = "800px"; // Force desktop width
        captureContainer.style.backgroundColor = "#ffffff";
        captureContainer.style.zIndex = "999999"; 
        
        // 2. Add a visual loading message
        const loadingMessage = document.createElement("div");
        loadingMessage.innerHTML = "<h2 style='text-align:center; padding: 40px; font-family:sans-serif; color: black;'>Generating your JPG...<br><small>Do not close this page.</small></h2>";
        captureContainer.appendChild(loadingMessage);

        // 3. Clone the resume
        const clone = document.getElementById("resume-preview").cloneNode(true);
        clone.className = activeTemplate;
        clone.style.margin = "0";
        clone.style.transform = "none";
        clone.style.boxShadow = "none"; 
        
        captureContainer.appendChild(clone);
        document.body.appendChild(captureContainer);

        const originalScroll = window.scrollY;
        window.scrollTo(0, 0);

        // 4. Generate JPG using html2canvas directly
        setTimeout(() => {
            html2canvas(clone, {
                scale: 2, // High resolution (double crispness) for image
                useCORS: true,
                windowWidth: 800,
                width: 800,
                scrollY: 0,
                backgroundColor: "#ffffff"
            }).then(canvas => {
                // Convert canvas to JPG
                const imgData = canvas.toDataURL("image/jpeg", 0.95);
                
                // Create a temporary link to download the image
                const link = document.createElement('a');
                link.href = imgData;
                link.download = safeFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Cleanup after success
                document.body.removeChild(captureContainer);
                window.scrollTo(0, originalScroll);
                downloadJpgBtn.innerText = originalText;
                downloadJpgBtn.disabled = false;
            }).catch(err => {
                console.error("JPG Error:", err);
                if(document.body.contains(captureContainer)) document.body.removeChild(captureContainer);
                window.scrollTo(0, originalScroll);
                alert("Memory error: Could not generate JPG.");
                downloadJpgBtn.innerText = originalText;
                downloadJpgBtn.disabled = false;
            });
        }, 1000); 
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
    if (customTitleInput) customTitleInput.value = data.customTitle || "";
    if (customContentInput) customContentInput.value = data.customContent || "";
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

    const savedShowCustom = localStorage.getItem("showCustom");
    if (savedShowCustom !== null && showCustomCheckbox) showCustomCheckbox.checked = savedShowCustom === "true";
    toggleCustom();

    // Load Newspaper Layout State
    const savedNewspaper = localStorage.getItem("showNewspaper");
    if (savedNewspaper !== null && showNewspaperCheckbox) {
        showNewspaperCheckbox.checked = savedNewspaper === "true";
        if (showNewspaperCheckbox.checked && resumeBody) {
            resumeBody.classList.add("newspaper");
        }
    }

    // Load Profile Image
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage && previewImage) {
        previewImage.src = savedImage;
    }

    // Load Selected Template
    const selectedTemplate = localStorage.getItem("selectedTemplate");
    if (selectedTemplate && previewContainer) {
        previewContainer.className = "";
        previewContainer.classList.add(selectedTemplate);
    }
});

// ========================
// 6. EXTREME AUTO-FIT ALGORITHM 
// ========================
function autoFitResume() {
    if (!previewContainer) return;

    previewContainer.style.transition = "none";
    previewContainer.style.minHeight = "0px";

    let currentSize = 11;       
    let currentLineHeight = 1.4;
    let currentSpacing = 1.0;   

    previewContainer.style.fontSize = currentSize + "px";
    previewContainer.style.setProperty('--line-height', currentLineHeight);
    previewContainer.style.setProperty('--spacing', currentSpacing + 'em');

    const maxSafeHeight = 1000; 
    let loops = 0; 

    // STAGE 1: Shrink font if still too big
    while (previewContainer.scrollHeight > maxSafeHeight && currentSize > 9 && loops < 50) {
        currentSize -= 0.2;
        previewContainer.style.fontSize = currentSize + "px";
        loops++;
    }

    // STAGE 2: Squash line spacing and margins aggressively
    while (previewContainer.scrollHeight > maxSafeHeight && currentLineHeight > 1.1 && loops < 100) {
        currentLineHeight -= 0.05;
        currentSpacing -= 0.1; 
        previewContainer.style.setProperty('--line-height', currentLineHeight);
        previewContainer.style.setProperty('--spacing', currentSpacing + 'em');
        loops++;
    }

    previewContainer.style.minHeight = "1122px";
    setTimeout(() => { 
        previewContainer.style.transition = "transform 0.3s, box-shadow 0.3s"; 
    }, 50);
}
