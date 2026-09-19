function filterClubs() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let clubCards = document.getElementsByClassName('club-card');
    let noResults = document.getElementById('no-results');
    let hasVisibleCards = false;

    for (let i = 0; i < clubCards.length; i++) {
        let clubName = clubCards[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        let clubDescription = clubCards[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        
        if (clubName.includes(input) || clubDescription.includes(input)) {
            clubCards[i].style.display = "flex"; 
            hasVisibleCards = true;
        } else {
            clubCards[i].style.display = "none";
        }
    }

    if (hasVisibleCards) {
        noResults.style.display = "none";
    } else {
        noResults.style.display = "block";
    }
}