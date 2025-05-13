const apiBaseUrl = "http://localhost:5678/api" // URL de base de l'API
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

const displayWorks = async () => {
  const works = await getWorks();
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = ""; // Vider le contenu existant de la galerie

  works.forEach(work => {
    const workCard = generateWorkCard(work);
    gallery.appendChild(workCard);
  });
}
















displayWorks();