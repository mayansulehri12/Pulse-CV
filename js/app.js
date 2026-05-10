/**
 * CertiCV - Core Application Logic
 * Handles State, Tabs, and Simulation
 */

const AppState = {
    view: 'landing', // Set default to landing
    activeTab: 'profile', // 'profile' | 'education' | 'experience' | 'skills' | 'preview'
    status: 'idle', 
    data: {
        personal_info: {
            full_name: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            portfolio: "",
            summary: "",
            age: "",
            dob_day: "",
            dob_month: "",
            dob_year: "",
            birth_country: "",
            profile_image: null
        },
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        projects: [],
        languages: []
    }
};

// Initialize
function initApp() {
    lucide.createIcons();
    loadFromLocalStorage();
    render();
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function startApp() {
    AppState.view = 'dashboard';
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupEventListeners() {
    // File Upload
    const uploadCard = document.getElementById('upload-card');
    const fileInput = document.getElementById('file-input');
    
    if (uploadCard) {
        uploadCard.onclick = () => fileInput.click();
        
        uploadCard.ondragover = (e) => {
            e.preventDefault();
            uploadCard.classList.add('drag-over');
        };
        
        uploadCard.ondragleave = () => {
            uploadCard.classList.remove('drag-over');
        };
        
        uploadCard.ondrop = (e) => {
            e.preventDefault();
            uploadCard.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        };
    }
    
    if (fileInput) {
        fileInput.onchange = (e) => handleFiles(e.target.files);
    }
}

function handleFiles(files) {
    if (files.length > 0) {
        startExtraction();
    }
}

function startExtraction() {
    AppState.status = 'processing';
    render();
    
    let progress = 0;
    const progressFill = document.getElementById('extraction-progress');
    const statusLabel = document.getElementById('extraction-status-label');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            AppState.status = 'success';
            AppState.view = 'dashboard';
            saveToLocalStorage();
            setTimeout(render, 500);
        }
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (statusLabel) {
            if (progress < 40) statusLabel.innerText = 'Scanning Documents...';
            else if (progress < 80) statusLabel.innerText = 'Extracting Strategic Insights...';
            else statusLabel.innerText = 'Optimizing ATS Structure...';
        }
    }, 250);
}

function switchTab(tabId) {
    AppState.activeTab = tabId;
    render();
}

function updatePersonalInfo(field, value) {
    AppState.data.personal_info[field] = value;
    saveToLocalStorage();
    renderPreview();
}

function updateExperience(index, field, value) {
    AppState.data.experience[index][field] = value;
    saveToLocalStorage();
    renderPreview();
}

function updateEducation(index, field, value) {
    AppState.data.education[index][field] = value;
    saveToLocalStorage();
    renderPreview();
}

function addExperience() {
    AppState.data.experience.push({
        company: "New Company",
        position: "New Position",
        start_date: "",
        end_date: "",
        description: ""
    });
    saveToLocalStorage();
    render();
}

function addEducation() {
    AppState.data.education.push({
        institution: "New Institution",
        degree: "New Degree",
        field: "New Field",
        date: "",
        gpa: ""
    });
    saveToLocalStorage();
    render();
}

function removeExperience(index) {
    AppState.data.experience.splice(index, 1);
    saveToLocalStorage();
    render();
}

function removeEducation(index) {
    AppState.data.education.splice(index, 1);
    saveToLocalStorage();
    render();
}

function addSkill(name, description, level = 80) {
    if (!name) return;
    AppState.data.skills.push({ name, description, level: parseInt(level) });
    saveToLocalStorage();
    render();
}

function removeSkill(index) {
    AppState.data.skills.splice(index, 1);
    saveToLocalStorage();
    render();
}

function addLanguage(name, level) {
    if (!name) return;
    AppState.data.languages.push({ name, level });
    saveToLocalStorage();
    render();
}

function removeLanguage(index) {
    AppState.data.languages.splice(index, 1);
    saveToLocalStorage();
    render();
}

function addCertification(name, date) {
    if (!name) return;
    AppState.data.certifications.push({ name, date });
    saveToLocalStorage();
    render();
}

function removeCertification(index) {
    AppState.data.certifications.splice(index, 1);
    saveToLocalStorage();
    render();
}

function handleProfileImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        AppState.data.personal_info.profile_image = e.target.result;
        saveToLocalStorage();
        render();
    };
    reader.readAsDataURL(file);
}

function saveToLocalStorage() {
    localStorage.setItem('certicv_data', JSON.stringify(AppState.data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('certicv_data');
    if (saved) {
        AppState.data = JSON.parse(saved);
    }
}

function render() {
    // Views
    const landing = document.getElementById('landing-view');
    const dashboard = document.getElementById('dashboard-view');
    
    if (AppState.view === 'landing') {
        landing.classList.remove('hidden');
        dashboard.classList.add('hidden');
    } else {
        landing.classList.add('hidden');
        dashboard.classList.remove('hidden');
        renderDashboard();
    }
    
    lucide.createIcons();
}

function renderDashboard() {
    // Sidebar Tabs
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.tab === AppState.activeTab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Panel Content
    const panelContent = document.getElementById('panel-content');
    const panelTitle = document.getElementById('panel-title');
    
    panelTitle.innerText = AppState.activeTab.charAt(0).toUpperCase() + AppState.activeTab.slice(1);
    
    let html = '';
    
    if (AppState.activeTab === 'profile') {
        html = `
            <div class="input-group">
                <label>Profile Image</label>
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: #2d3748; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px solid var(--primary);">
                        ${AppState.data.personal_info.profile_image ? `<img src="${AppState.data.personal_info.profile_image}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i data-lucide="user" style="color: #718096;"></i>`}
                    </div>
                    <button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.8rem;" onclick="document.getElementById('profile-img-input').click()">Change Photo</button>
                    <input type="file" id="profile-img-input" hidden accept="image/*" onchange="handleProfileImage(this.files[0])">
                </div>
            </div>
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" value="${AppState.data.personal_info.full_name}" oninput="updatePersonalInfo('full_name', this.value)">
            </div>
            <div class="input-group">
                <label>Summary / Objective</label>
                <textarea rows="3" oninput="updatePersonalInfo('summary', this.value)">${AppState.data.personal_info.summary || ''}</textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="input-group">
                    <label>Email Address</label>
                    <input type="text" value="${AppState.data.personal_info.email}" oninput="updatePersonalInfo('email', this.value)">
                </div>
                <div class="input-group">
                    <label>Phone Number</label>
                    <input type="text" value="${AppState.data.personal_info.phone}" oninput="updatePersonalInfo('phone', this.value)">
                </div>
            </div>
            <div class="input-group">
                <label>Location</label>
                <input type="text" value="${AppState.data.personal_info.location}" oninput="updatePersonalInfo('location', this.value)">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="input-group">
                    <label>LinkedIn</label>
                    <input type="text" value="${AppState.data.personal_info.linkedin || ''}" oninput="updatePersonalInfo('linkedin', this.value)">
                </div>
                <div class="input-group">
                    <label>Portfolio / Website</label>
                    <input type="text" value="${AppState.data.personal_info.portfolio || ''}" oninput="updatePersonalInfo('portfolio', this.value)">
                </div>
            </div>
        `;
    } else if (AppState.activeTab === 'personal') {
        html = `
            <div class="input-group">
                <label>Age</label>
                <input type="text" value="${AppState.data.personal_info.age || ''}" placeholder="e.g. 25" oninput="updatePersonalInfo('age', this.value)">
            </div>
            <div class="input-group">
                <label>Date of Birth</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                    <input type="text" value="${AppState.data.personal_info.dob_day || ''}" placeholder="DD" maxlength="2" oninput="updatePersonalInfo('dob_day', this.value)">
                    <input type="text" value="${AppState.data.personal_info.dob_month || ''}" placeholder="MM" maxlength="2" oninput="updatePersonalInfo('dob_month', this.value)">
                    <input type="text" value="${AppState.data.personal_info.dob_year || ''}" placeholder="YYYY" maxlength="4" oninput="updatePersonalInfo('dob_year', this.value)">
                </div>
            </div>
            <div class="input-group">
                <label>Birth Country</label>
                <input type="text" value="${AppState.data.personal_info.birth_country || ''}" placeholder="e.g. United Kingdom" oninput="updatePersonalInfo('birth_country', this.value)">
            </div>
        `;
    } else if (AppState.activeTab === 'experience') {
        AppState.data.experience.forEach((exp, i) => {
            html += `
                <div style="padding: 16px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; position: relative;">
                    <button style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6" onclick="removeExperience(${i})">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                    <div class="input-group">
                        <label>Company</label>
                        <input type="text" value="${exp.company}" oninput="updateExperience(${i}, 'company', this.value)">
                    </div>
                    <div class="input-group">
                        <label>Position</label>
                        <input type="text" value="${exp.position}" oninput="updateExperience(${i}, 'position', this.value)">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                         <div class="input-group">
                            <label>Start Date</label>
                            <input type="text" value="${exp.start_date}" oninput="updateExperience(${i}, 'start_date', this.value)">
                        </div>
                         <div class="input-group">
                            <label>End Date</label>
                            <input type="text" value="${exp.end_date}" oninput="updateExperience(${i}, 'end_date', this.value)">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Description</label>
                        <textarea rows="3" oninput="updateExperience(${i}, 'description', this.value)">${exp.description}</textarea>
                    </div>
                </div>
            `;
        });
        html += `<button class="btn btn-outline" style="width: 100%;" onclick="addExperience()">+ Add Experience</button>`;
    } else if (AppState.activeTab === 'education') {
        AppState.data.education.forEach((edu, i) => {
            html += `
                <div style="padding: 16px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; position: relative;">
                    <button style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6" onclick="removeEducation(${i})">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                    <div class="input-group">
                        <label>Institution</label>
                        <input type="text" value="${edu.institution}" oninput="updateEducation(${i}, 'institution', this.value)">
                    </div>
                    <div class="input-group">
                        <label>Degree</label>
                        <input type="text" value="${edu.degree}" oninput="updateEducation(${i}, 'degree', this.value)">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="input-group">
                            <label>Field of Study</label>
                            <input type="text" value="${edu.field || ''}" oninput="updateEducation(${i}, 'field', this.value)">
                        </div>
                        <div class="input-group">
                            <label>GPA / Grade</label>
                            <input type="text" value="${edu.gpa || ''}" oninput="updateEducation(${i}, 'gpa', this.value)">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Graduation Date</label>
                        <input type="text" value="${edu.date || ''}" oninput="updateEducation(${i}, 'date', this.value)">
                    </div>
                </div>
            `;
        });
        html += `<button class="btn btn-outline" style="width: 100%;" onclick="addEducation()">+ Add Education</button>`;
    } else if (AppState.activeTab === 'skills') {
        html = `
            <div style="padding: 16px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px;">
                <div class="input-group">
                    <label>Skill Name</label>
                    <input type="text" id="skill-name" placeholder="e.g. Graphic Design">
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <input type="text" id="skill-desc" placeholder="e.g. Branding & Logo Design">
                </div>
                <div class="input-group">
                    <label>Skill Level (%)</label>
                    <input type="range" id="skill-level" min="1" max="100" value="80" oninput="this.nextElementSibling.innerText = this.value + '%'">
                    <span style="font-size: 0.8rem; color: var(--primary-light);">80%</span>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="addSkill(document.getElementById('skill-name').value, document.getElementById('skill-desc').value, document.getElementById('skill-level').value);">Add Skill</button>
            </div>
            <div style="margin-top: 24px;">
                <label style="display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;">Active Skills</label>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${(AppState.data.skills || []).map((skill, i) => `
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 12px; border-radius: 12px; position: relative;">
                            <button style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6;" onclick="removeSkill(${i})">
                                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                            </button>
                            <div style="font-weight: 700; color: var(--primary-light); font-size: 0.9rem;">${skill.name} (${skill.level}%)</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">${skill.description || ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (AppState.activeTab === 'languages') {
        html = `
            <div style="padding: 16px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px;">
                <div class="input-group">
                    <label>Language Name</label>
                    <input type="text" id="lang-name" placeholder="e.g. French">
                </div>
                <div class="input-group">
                    <label>Proficiency Level</label>
                    <input type="text" id="lang-level" placeholder="e.g. Native, Professional, Basic">
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="addLanguage(document.getElementById('lang-name').value, document.getElementById('lang-level').value);">Add Language</button>
            </div>
            <div style="margin-top: 24px;">
                <label style="display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;">Active Languages</label>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${(AppState.data.languages || []).map((lang, i) => `
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 12px; border-radius: 12px; position: relative;">
                            <button style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6;" onclick="removeLanguage(${i})">
                                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                            </button>
                            <div style="font-weight: 700; color: var(--primary-light);">${lang.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">${lang.level}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (AppState.activeTab === 'certifications') {
        html = `
            <div style="padding: 16px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px;">
                <div class="input-group">
                    <label>Certification Name</label>
                    <input type="text" id="cert-name" placeholder="e.g. CCNA">
                </div>
                <div class="input-group">
                    <label>Date Issued</label>
                    <input type="text" id="cert-date" placeholder="e.g. 2023">
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="addCertification(document.getElementById('cert-name').value, document.getElementById('cert-date').value);">Add Certification</button>
            </div>
            <div style="margin-top: 24px;">
                <label style="display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;">Active Certifications</label>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${(AppState.data.certifications || []).map((cert, i) => `
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 12px; border-radius: 12px; position: relative;">
                            <button style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6;" onclick="removeCertification(${i})">
                                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                            </button>
                            <div style="font-weight: 700; color: var(--primary-light);">${cert.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-dim);">Issued ${cert.date}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    panelContent.innerHTML = html;
    renderPreview();
}

function renderPreview() {
    const preview = document.getElementById('resume-preview');
    if (!preview) return;
    
    const d = AppState.data;
    
    const expHtml = (d.experience || []).map(exp => `
        <div class="resume-item">
            <div class="resume-item-header">
                <span>${exp.company || 'Company'}</span>
                <span class="resume-item-date">${exp.start_date || ''} – ${exp.end_date || ''}</span>
            </div>
            <div class="resume-item-sub">${exp.position || 'Position'}</div>
            <div class="resume-item-bullets">${exp.description || ''}</div>
        </div>
    `).join('');
    
    const eduHtml = (d.education || []).map(edu => `
        <div class="resume-item">
            <div class="resume-item-header">
                <span>${edu.institution || 'Institution'}</span>
                <span class="resume-item-date">${edu.date || ''}</span>
            </div>
            <div class="resume-item-sub">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
        </div>
    `).join('');

    const skillsHtml = (d.skills || []).map(skill => `
        <div class="skill-tag-cv">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4px;">
                <div class="skill-name-cv">${skill.name}</div>
                <div style="font-size: 9px; font-weight: 700; color: var(--primary);">${skill.level}%</div>
            </div>
            <div style="width: 100%; height: 4px; background: #edf2f7; border-radius: 100px; overflow: hidden; margin-bottom: 4px;">
                <div style="width: ${skill.level}%; height: 100%; background: var(--primary);"></div>
            </div>
            <div class="skill-desc-cv">${skill.description || ''}</div>
        </div>
    `).join('');

    const certsHtml = (d.certifications || []).map(cert => `
        <div style="margin-bottom: 8px; font-size: 11px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="award" style="width: 12px; color: var(--primary);"></i>
            <div>
                <div style="font-weight: 700; color: #2d3748;">${cert.name || cert}</div>
                <div style="font-size: 9px; color: #a0aec0;">Issued ${cert.date || ''}</div>
            </div>
        </div>
    `).join('');

    const projectsHtml = (d.projects || []).map(proj => `
        <div style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 12px; color: #2d3748;">${proj.name}</div>
            <div style="font-size: 11px; color: #4a5568; line-height: 1.4; margin-top: 2px;">${proj.description}</div>
        </div>
    `).join('');

    const languagesHtml = (d.languages || []).map(lang => `
        <div style="margin-bottom: 4px; font-size: 11px; display: flex; justify-content: space-between;">
            <span style="font-weight: 600; color: #2d3748;">${lang.name}</span>
            <span style="color: #718096;">${lang.level}</span>
        </div>
    `).join('');
    
    const dobStr = [d.personal_info.dob_day, d.personal_info.dob_month, d.personal_info.dob_year].filter(Boolean).join('/');

    preview.innerHTML = `
        <div class="resume-header" style="display: flex; align-items: center; gap: 24px; text-align: center; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 24px; text-align: left; width: 100%;">
                ${d.personal_info.profile_image ? `<img src="${d.personal_info.profile_image}" style="width: 90px; height: 90px; border-radius: 16px; object-fit: cover; border: 3px solid var(--primary);">` : ''}
                <div style="flex: 1;">
                    <h1 style="margin-bottom: 4px; text-transform: uppercase;">${d.personal_info.full_name}</h1>
                    <div class="resume-contact">
                        <span><i data-lucide="map-pin" style="width: 12px;"></i> ${d.personal_info.location}</span>
                        <span><i data-lucide="phone" style="width: 12px;"></i> ${d.personal_info.phone}</span>
                        <span><i data-lucide="mail" style="width: 12px;"></i> ${d.personal_info.email}</span>
                    </div>
                    <div class="resume-contact" style="justify-content: flex-start; margin-top: 4px;">
                        ${d.personal_info.linkedin ? `<span><i data-lucide="linkedin" style="width: 12px;"></i> ${d.personal_info.linkedin}</span>` : ''}
                        ${d.personal_info.portfolio ? `<span><i data-lucide="globe" style="width: 12px;"></i> ${d.personal_info.portfolio}</span>` : ''}
                    </div>
                    ${(d.personal_info.age || dobStr || d.personal_info.birth_country) ? `
                    <div class="resume-contact" style="justify-content: flex-start; margin-top: 4px; border-top: 1px solid #edf2f7; padding-top: 4px;">
                        ${d.personal_info.age ? `<span><i data-lucide="user" style="width: 12px;"></i> Age: ${d.personal_info.age}</span>` : ''}
                        ${dobStr ? `<span><i data-lucide="calendar" style="width: 12px;"></i> Born: ${dobStr}</span>` : ''}
                        ${d.personal_info.birth_country ? `<span><i data-lucide="globe" style="width: 12px;"></i> Origin: ${d.personal_info.birth_country}</span>` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="resume-grid">
            <div class="resume-sidebar">
                <div class="resume-section">
                    <h2>Contact & Info</h2>
                    <div style="font-size: 11px; color: #4a5568; line-height: 1.6;">
                        Available for worldwide opportunities and remote collaboration.
                    </div>
                </div>

                ${skillsHtml ? `
                    <div class="resume-section">
                        <h2>Expertise</h2>
                        ${skillsHtml}
                    </div>
                ` : ''}

                ${certsHtml ? `
                    <div class="resume-section">
                        <h2>Certifications</h2>
                        ${certsHtml}
                    </div>
                ` : ''}

                ${languagesHtml ? `
                    <div class="resume-section">
                        <h2>Languages</h2>
                        <div style="line-height: 1.6;">
                            ${languagesHtml}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="resume-main">
                ${d.personal_info.summary ? `
                    <div class="resume-section">
                        <h2>Executive Summary</h2>
                        <div style="font-size: 12px; color: #4a5568; line-height: 1.6; text-align: justify;">
                            ${d.personal_info.summary}
                        </div>
                    </div>
                ` : ''}

                ${expHtml ? `
                    <div class="resume-section">
                        <h2>Professional Experience</h2>
                        ${expHtml}
                    </div>
                ` : ''}

                ${projectsHtml ? `
                    <div class="resume-section">
                        <h2>Featured Projects</h2>
                        ${projectsHtml}
                    </div>
                ` : ''}
                
                ${eduHtml ? `
                    <div class="resume-section">
                        <h2>Education Background</h2>
                        ${eduHtml}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Initialize icons in preview
    setTimeout(() => lucide.createIcons(), 0);
}

function exportPDF() {
    const oldTitle = document.title;
    const name = AppState.data.personal_info.full_name || 'User';
    document.title = `${name} CV`;
    window.print();
    setTimeout(() => {
        document.title = oldTitle;
    }, 100);
}

function resetApp() {
    localStorage.removeItem('certicv_data');
    location.reload();
}
