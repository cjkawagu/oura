function toggleTheme() {
    document.body.classList.toggle('dark-mode'); // Toggle between dark and light mode

    const isDarkMode = document.body.classList.contains('dark-mode'); // Check if dark mode is active
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Store the preference in localStorage
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
                <section class="content-area" id="graph"></section>
                <br>
                <br>
            </div>
        `;
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
                <section class="content-area" id="graph"></section>
                <br>
                <br>
            </div>
        `;
    } else if (page === 'patient-overview') {
        contentTitle = 'Patient Overview';
        contentHTML = `
            <h1>&nbsp; ${contentTitle}</h1>
            <div></div>
        `;
    }

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = contentHTML;
    mainContent.appendChild(contentDiv); // Add the new content
    
    document.querySelectorAll('.sidebar-item').forEach((item) => {
        item.classList.remove('selected'); // Unselect all sidebar items
    });
    document.querySelector(`[data-page-link="${page}"]`).classList.add('selected'); // Highlight the selected item
    
    localStorage.setItem('lastPage', page); // Persist the selected page
}

// Restore sidebar selection and theme mode on page load
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
});
