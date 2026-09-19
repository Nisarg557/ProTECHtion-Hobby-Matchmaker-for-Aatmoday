// clubs.js
import { db, collection, getDocs } from './firebase.js';

async function loadClubsDirectory() {
    const gridContainer = document.getElementById('clubs-grid');
    
    try {
        // 1. Fetch from Firebase instead of local JSON
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubs = [];
        
        querySnapshot.forEach((doc) => {
            clubs.push(doc.data()); 
        });
        
        if (clubs.length === 0) {
            gridContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center;">No clubs found.</div>';
            return;
        }

        // 2. Your exact original rendering code! (Untouched)
        gridContainer.innerHTML = clubs.map((club, index) => `
            <div class="club-card animate-fade-up" style="animation-delay: ${index * 0.1}s">
                <div class="card-icon">${club.icon || '🎯'}</div>
                <h3>${club.name}</h3>
                <p>${club.description}</p>
                <a href="club.html?id=${club.id}" class="btn-outline">View Club Details →</a>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading clubs directory from Firebase:", error);
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #d90429;">
                <p>Failed to load clubs. Check your console for Firebase errors.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadClubsDirectory);