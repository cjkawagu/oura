function highlightTab(selectedTab) {
    // Remove the 'selected' class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('selected');
    });
    // Add the 'selected' class to the clicked tab
    selectedTab.classList.add('selected');
}
