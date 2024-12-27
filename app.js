document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    // Validate username
    function validateUserName(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    // Fetch user details
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch details");
            }
            const data = await response.json();

            // Update UI with data
            updateUI(data);

        } catch (error) {
            statsContainer.innerHTML = `<p>No data found for the username "${username}".</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Update the UI
    function updateUI(data) {
        const { totalSolved, totalQuestions, easySolved, totalEasy, mediumSolved, totalMedium, hardSolved, totalHard } = data;

        // Calculate percentages
        const easyPercentage = Math.round((easySolved / totalEasy) * 100) || 0;
        const mediumPercentage = Math.round((mediumSolved / totalMedium) * 100) || 0;
        const hardPercentage = Math.round((hardSolved / totalHard) * 100) || 0;

        // Set progress degrees and labels dynamically
        updateCircleProgress(easyProgressCircle, easyPercentage, easyLabel, easySolved, totalEasy);
        updateCircleProgress(mediumProgressCircle, mediumPercentage, mediumLabel, mediumSolved, totalMedium);
        updateCircleProgress(hardProgressCircle, hardPercentage, hardLabel, hardSolved, totalHard);

        // Populate stats card
        cardStatsContainer.innerHTML = `
            <h3>User Statistics</h3>
            <p><strong>Total Solved:</strong> ${totalSolved}/${totalQuestions}</p>
            <p><strong>Easy:</strong> ${easySolved}/${totalEasy}</p>
            <p><strong>Medium:</strong> ${mediumSolved}/${totalMedium}</p>
            <p><strong>Hard:</strong> ${hardSolved}/${totalHard}</p>
        `;
    }

    // Update Circle Progress (sets progress degree and label)
    function updateCircleProgress(circle, percentage, label, solved, total) {
        // Set CSS variable for conic gradient
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);

        // Update the label inside the circle
        label.textContent = `${solved}/${total}`;
    }

    
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (validateUserName(username)) {
            fetchUserDetails(username);
        }
    });
});
