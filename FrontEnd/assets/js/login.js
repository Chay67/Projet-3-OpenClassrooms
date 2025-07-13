const apiBaseUrl = "http://localhost:5678/api";
const isLoggedIn = !!sessionStorage.getItem("token") || false;

document.addEventListener("DOMContentLoaded", function () {
    if (isLoggedIn) {
        window.location.href = "index.html"; // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
        return;
    }
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("loginErrorMessage");

    errorMessage.style.display = "none";

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {
            errorMessage.textContent = "Veuillez remplir tous les champs requis.";
            errorMessage.style.display = "block";
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage.textContent = data.message || "E-mail et / ou mot de passe invalide(s)";
                errorMessage.style.display = "block";
                return;
            }

            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
            errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer plus tard.";
            errorMessage.style.display = "block";
        }
    });
});
