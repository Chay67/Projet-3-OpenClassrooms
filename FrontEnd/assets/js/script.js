const apiBaseUrl = "http://localhost:5678/api" // URL de base de l'API
let works = [] // Liste des travaux
let workCategories = [] // Liste des catégories de travaux

// Vérifie si un token existe dans le sessionStorage
let isLoggedIn = !!sessionStorage.getItem("token") || false;
let sessionToken = sessionStorage.getItem("token") || null;

console.log("isLoggedIn:", isLoggedIn);
console.log("sessionToken:", sessionToken);

/**
 * Récupérer la liste des travaux via l'API
 * 1. Créer une fonction asynchrone qui s'appelera getWorks
 * 2. Utiliser fetch pour récupérer les données de l'API
 * 3. Convertir la réponse en JSON
 * 4. Retourner les données JSON
 */

const getWorks = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/works`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

/**
 * Récupérer la liste des catégories via l'API
 * 1. Créer une fonction asynchrone qui s'appelera getCategories
 * 2. Utiliser fetch pour récupérer les données de l'API
 * 3. Convertir la réponse en JSON
 * 4. Retourner les données JSON
 */

const getCategories = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/categories`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

const generateWorkCard = (work) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

/**
 * Générer et ajouter au DOM les cartes de travaux par rapport aux données de l'API
 * 1. Récupérer la liste des travaux via l'API
 * 2. Récupérer l'élément parent dans lequel on va ajouter les cartes de travaux
 * 3. Pour chaque travail, créer une carte de travail
 * 4. Ajouter la carte de travail au DOM
 */

const displayWorks = async (data) => {
  if ((!works || !works.length) && !data) {
    works = await getWorks();
  }

  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = ""; // Vider le contenu existant de la galerie

  if (data) {
    data.forEach(work => {
      const workCard = generateWorkCard(work);
      gallery.appendChild(workCard);
    });
  } else {
    works.forEach(work => {
      const workCard = generateWorkCard(work);
      gallery.appendChild(workCard);
    });
  }
}

/**
 * Générer et ajouter au DOM les filtres de catégories par rapport aux données de l'API
 * 1. Récupérer la liste des catégories via l'API
 * 2. Récupérer l'élément parent dans lequel on va ajouter les filtres de catégories
 * 3. Pour chaque catégorie, créer un filtre de catégorie
 * 4. Ajouter le filtre de catégorie au DOM
 */

const generateCategoryFilter = (category, all) => {
  const button = document.createElement("button");
  button.classList.add("filter-button");
  if (all) {
    button.classList.add("active");
  }

  button.textContent = all ? "Tous" : category.name;

  button.addEventListener("click", async () => {
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    if (all) {
      displayWorks();
      return;
    }

    const filteredWorks = works.filter(work => work.categoryId === category.id);
    displayWorks(filteredWorks);
  })

  return button;
}

const displayCategoryFilters = async () => {
  const categories = await getCategories();

  workCategories = categories;

  const filtersContainer = document.querySelector(".filters");

  filtersContainer.innerHTML = ""; // Vider le contenu existant des filtres
  filtersContainer.appendChild(generateCategoryFilter(null, true));

  categories.forEach(category => {
    const categoryFilter = generateCategoryFilter(category);
    filtersContainer.appendChild(categoryFilter);
  });
}

if (isLoggedIn) {
  const loginButtonContainer = document.getElementById("loginButtonContainer");
  const loginButton = document.querySelector("#loginButtonContainer>a")
  loginButton.style.display = "none"; // Cacher le bouton de connexion

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "logout";
  logoutButton.addEventListener("click", () => {

    sessionStorage.removeItem("token");

    isLoggedIn = false;
    sessionToken = null;

    loginButton.style.display = "block"; // Afficher le bouton de connexion
    logoutButton.remove(); // Supprimer le bouton de déconnexion
  });
  
  loginButtonContainer.appendChild(logoutButton);
}












displayWorks();
displayCategoryFilters();

// Export the variables 
export { apiBaseUrl, isLoggedIn, sessionToken, works, workCategories }