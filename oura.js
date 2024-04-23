function toggleTheme() {
    document.body.classList.toggle('dark-mode'); // Toggle between dark and light mode
    const isDarkMode = document.body.classList.contains('dark-mode'); // Check if dark mode is active
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Store the preference in localStorage
}

function highlightTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
        tab.classList.remove('selected');
    });
    tab.classList.add('selected');
}

function showPage(page) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = ''; // Clear previous content
  
    let contentTitle = '';
    let contentHTML = '';
  
    if (page === 'weight-dose') {
        contentTitle = 'Weight & Dose';
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
        `; // OKAY BASICALLY JUST CHANGE THE URL OF THE GRAPH AND IT SHOULD BE ABLE TO POPULATE IT! THIS ONE IS OURAGRAPH1
    } else if (page === 'sleep-calories') {
        contentTitle = 'Sleep & Calories';
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
                    <iframe src="graph/ouragraph.html" class="ouraGraph2"></iframe>
                </div>
            </div>
        `; // OKAY BASICALLY JUST CHANGE THE URL OF THE GRAPH AND IT SHOULD BE ABLE TO POPULATE IT! THIS ONE IS OURAGRAPH2
    } else if (page === 'patient-overview') {
        contentTitle = 'Patient Overview';
        contentHTML = `
            <h1>&nbsp; ${contentTitle}</h1>
            <div class="graph-container">
                <br>
                <br>
                <br>
                <br>
                <br>
            </div>
        `;
    }

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = contentHTML;
    mainContent.appendChild(contentDiv);

    const weeklyTab = contentDiv.querySelector('.tab:nth-child(2)');
    if (weeklyTab) {
        highlightTab(weeklyTab);
    }

    document.querySelectorAll('.sidebar-item').forEach((item) => {
        item.classList.remove('selected'); // Unselect all sidebar items
    });
    document.querySelector(`[data-page-link="${page}"]`).classList.add('selected'); // Highlight the selected item

    localStorage.setItem('lastPage', page); // Persist the selected page
}

function saveProviderName() {
    const providerName = document.getElementById('providerName').value;
    localStorage.setItem('providerName', providerName);
}

function loadProviderName() {
    const providerName = localStorage.getItem('providerName');
    if (providerName) {
        document.getElementById('providerName').value = providerName;
    }
}

// Restore sidebar selection, theme mode, and provider name on page load
window.addEventListener('load', () => {
    const lastPage = localStorage.getItem('lastPage');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode'); // Remove dark mode for light mode
    } else {
        document.body.classList.add('dark-mode'); // Default to dark mode
    }

    if (lastPage) {
        showPage(lastPage); // Restore the selected page
    } else {
        showPage('weight-dose'); // Default to 'Weight & Dose'
    }

    loadProviderName(); // Load the saved provider name
});