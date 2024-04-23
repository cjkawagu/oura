function toggleTheme() {
    document.body.classList.toggle("dark-mode"); // Toggle between dark and light mode
    const isDarkMode = document.body.classList.contains("dark-mode"); // Check if dark mode is active
    localStorage.setItem("theme", isDarkMode ? "dark" : "light"); // Store the preference in localStorage
  }
  
  function highlightTab(tab) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.classList.remove("selected");
    });
    tab.classList.add("selected");
  }
  
  function showPage(page) {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = ""; // Clear previous content
  
    let contentTitle = "";
    let contentHTML = "";
  
    if (page === "weight-dose") {
      contentTitle = "Sleep Quality";
      contentHTML = `
        <h1>&nbsp; ${contentTitle}</h1>
        <div class="graph-container">
          <br>
          <div class="tab-container">
            <button class="tab" onclick="highlightTab(this)">Daily</button>
            <button class="tab" onclick="highlightTab(this)">Weekly</button>
            <button class="tab" onclick="highlightTab(this)">Monthly</button>
            <button class="tab" onclick="highlightTab(this)">Yearly</button>
          </div>
          <div class="content-area" id="graph">
            <iframe src="graph/ouragraph.html" class="ouraGraph1"></iframe> 
          </div>
        </div>
      `;
    } else if (page === "sleep-calories") {
      contentTitle = "Weight & Activity";
      contentHTML = `
        <h1>&nbsp; ${contentTitle}</h1>
        <div class="graph-container">
          <br>
          <div class="tab-container">
            <button class="tab" onclick="highlightTab(this)">Daily</button>
            <button class="tab" onclick="highlightTab(this)">Weekly</button>
            <button class="tab" onclick="highlightTab(this)">Monthly</button>
            <button class="tab" onclick="highlightTab(this)">Yearly</button>
          </div>
          <div class="content-area" id="graph">
            <iframe src="graph2/graph2.html" class="ouraGraph2"></iframe>
          </div>
        </div>
      `;
    } else if (page === "patient-overview") {
      contentTitle = "Patient Overview";
      contentHTML = `
        <h1>&nbsp; ${contentTitle}</h1>
        
        <div class="graph-container patient-overview">
                <div class="patient-info">
                <div class="info-group">
                <div class="info-item">
                    <label for="patientName">Patient Name:</label>
                    <input type="text" id="patientName" placeholder="Enter patient name">
                </div>
                <div class="info-item">
                    <label for="patientID">Patient ID:</label>
                    <input type="text" id="patientID" placeholder="Enter patient ID">
                </div>
                </div>
                <div class="info-group">
                <div class="info-item">
                    <label for="dateOfBirth">Date of Birth:</label>
                    <input type="date" id="dateOfBirth">
                </div>
                <div class="info-item">
                    <label for="gender">Gender:</label>
                    <input type="text" id="gender" placeholder="Enter gender">
                </div>
                </div>
                <div class="info-group">
                <div class="info-item">
                    <label for="allergies">Allergies:</label>
                    <input type="text" id="allergies" placeholder="Enter allergies">
                </div>
                <div class="info-item">
                    <label for="currentMedication">Current Medication:</label>
                    <input type="text" id="currentMedication" placeholder="Enter medication">
                </div>
                </div>
            </div>
            
            <div class="patient-details">
                <div class="details-left">
                <h3>Provider Notes</h3>
                <textarea id="providerNotes" placeholder="Enter provider notes"></textarea>
                </div>
            
                <div class="details-right">
                <br> <br> <br>
            
                <div class="detail-item">
                    <h3>Vitals</h3>
                    <textarea id="vitals" placeholder="Enter vitals"></textarea>
                </div>
            
                <div class="detail-item">
                    <h3>Prescriptions</h3>
                    <textarea id="prescriptions" placeholder="Enter prescriptions"></textarea>
                </div>
            
                <div class="detail-item">
                    <h3>Lab Results</h3>
                    <textarea id="labResults" placeholder="Enter lab results"></textarea>
                </div>
            
                <div class="detail-item">
                    <h3>Medical Images</h3>
                    <textarea id="medicalImages" placeholder="Enter medical images"></textarea>
                </div>
            
                <div class="detail-item">
                    <h3>Medical History</h3>
                    <textarea id="medicalHistory" placeholder="Enter medical history"></textarea>
                </div>
            
                <div class="detail-item">
                    <h3>Documents</h3>
                    <textarea id="documents" placeholder="Enter documents"></textarea>
                </div>
                </div>
            </div>

            <div class="save-button-container">
            <div class="save-button-wrapper">
              <button id="saveButton" onclick="savePatientInfo()">Save</button>
            </div>
          </div>
         </div>

        </div>
  
        
      `;
    }
  
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = contentHTML;
    mainContent.appendChild(contentDiv);
  
    const weeklyTab = contentDiv.querySelector(".tab:nth-child(2)");
    if (weeklyTab) {
      highlightTab(weeklyTab);
    }
  
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.classList.remove("selected"); // Unselect all sidebar items
    });
    document.querySelector(`[data-page-link="${page}"]`).classList.add("selected"); // Highlight selected item
  
    localStorage.setItem("lastPage", page); // Persist the selected page
  }
  
  function saveProviderName() {
    const providerName = document.getElementById("providerName").value;
    localStorage.setItem("providerName", providerName);
  }
  
  function loadProviderName() {
    const providerName = localStorage.getItem("providerName");
    if (providerName) {
      document.getElementById("providerName").value = providerName;
    }
  }
  
  function savePatientInfo() {
    const patientName = document.getElementById("patientName").value;
    const patientID = document.getElementById("patientID").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const gender = document.getElementById("gender").value;
    const allergies = document.getElementById("allergies").value;
    const currentMedication = document.getElementById("currentMedication").value;
    const providerNotes = document.getElementById("providerNotes").value;
    const vitals = document.getElementById("vitals").value;
    const prescriptions = document.getElementById("prescriptions").value;
    const labResults = document.getElementById("labResults").value;
    const medicalImages = document.getElementById("medicalImages").value;
    const medicalHistory = document.getElementById("medicalHistory").value;
    const documents = document.getElementById("documents").value;
  
    const patientInfo = {
      patientName,
      patientID,
      dateOfBirth,
      gender,
      allergies,
      currentMedication,
      providerNotes,
      vitals,
      prescriptions,
      labResults,
      medicalImages,
      medicalHistory,
      documents,
    };
  
    localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
  
    // Display a confirmation message
    alert("Patient information saved successfully!");
  
    // Capture a screenshot of the page
    captureScreenshot();
  }
  
  function captureScreenshot() {
    html2canvas(document.body).then(function (canvas) {
      var screenshotURL = canvas.toDataURL("image/png");
      var link = document.createElement("a");
      link.href = screenshotURL;
      link.download = "patient_overview_screenshot.png";
      link.click();
    });
  }
  
  function loadPatientInfo() {
    const patientInfo = JSON.parse(localStorage.getItem("patientInfo"));
    if (patientInfo) {
      document.getElementById("patientName").value = patientInfo.patientName;
      document.getElementById("patientID").value = patientInfo.patientID;
      document.getElementById("dateOfBirth").value = patientInfo.dateOfBirth;
      document.getElementById("gender").value = patientInfo.gender;
      document.getElementById("allergies").value = patientInfo.allergies;
      document.getElementById("currentMedication").value = patientInfo.currentMedication;
      document.getElementById("providerNotes").value = patientInfo.providerNotes;
      document.getElementById("vitals").value = patientInfo.vitals;
      document.getElementById("prescriptions").value = patientInfo.prescriptions;
      document.getElementById("labResults").value = patientInfo.labResults;
      document.getElementById("medicalImages").value = patientInfo.medicalImages;
      document.getElementById("medicalHistory").value = patientInfo.medicalHistory;
      document.getElementById("documents").value = patientInfo.documents;
    }
  }
  
  // Restore sidebar selection, theme mode, provider name, and patient info on page load
  window.addEventListener("load", () => {
    const lastPage = localStorage.getItem("lastPage");
    const savedTheme = localStorage.getItem("theme");
  
    if (savedTheme === "light") {
      document.body.classList.remove("dark-mode"); // Remove dark mode for light mode
    } else {
      document.body.classList.add("dark-mode"); // Default to dark mode
    }
  
    if (lastPage) {
      showPage(lastPage); // Restore the selected page
    } else {
      showPage("weight-dose"); // Default to 'Weight & Dose'
    }
  
    loadProviderName(); // Load the saved provider name
    loadPatientInfo(); // Load the saved patient information
  });