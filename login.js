// Handle login functionality
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Clear any previous error messages
    errorMessage.textContent = "";

    // Validate inputs
    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password.";
        return;
    }

    try {
        // Fetch user data from JSON
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(`Failed to load user data. Status: ${response.status}`);
        }

        const data = await response.json();

        // Validate fetched data
        if (!data || !Array.isArray(data.users)) {
            throw new Error("Invalid data format: 'users' must be an array.");
        }

        // Find user matching credentials
        const user = data.users.find((u) => u.username === username && u.password === password);

        if (user) {
            // Save login status and username in localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", user.username);

            // Redirect to index.html
            window.location.href = "index.html";
        } else {
            // Show error message for invalid credentials
            errorMessage.textContent = "Invalid username or password.";
        }
    } catch (error) {
        console.error("Error during login:", error);
        errorMessage.textContent = "An error occurred. Please try again later.";
    }
});
