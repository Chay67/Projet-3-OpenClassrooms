import { isLoggedIn, apiBaseUrl, sessionToken, works, workCategories} from "./script.js";

console.table({
    isLoggedIn,
    sessionToken,
    works,
    workCategories,
    apiBaseUrl
})

const editionButton = document.getElementById("editButton");

if (isLoggedIn) {
    // Gallery modal
    const modalContainer = document.getElementById("modalContainer");
    const modalCloseButton = document.getElementById("closeModal");
    const addWorkButton = document.getElementById("addWorkButton");

    // Add work modal
    const addWorkModalContainer = document.getElementById("addWorkModalContainer");
    const addWorkModalCloseButton = document.getElementById("closeAddWorkModal");
    const returnToEditionModalButton = document.getElementById("returnToEditionModal");

    const toggleModal = (element, state) => {    
        if (element) {
            if (state) {
                element.style.display = "flex";
            } else {
                element.style.display = "none";
            }
        }
    }

    const fillModalGallery = () => {
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = "";

        works.forEach((work) => {
            const item = generateModalGalleryItem(work);
            modalGallery.appendChild(item);
        });

        return true;
    }

    const generateModalGalleryItem = (work) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("modal-gallery-item");

        const deleteButton = document.createElement("button");

        deleteButton.addEventListener("click", () => {
            console.log("delete", work.id);
        });

        const deleteButtonImg = document.createElement("img");
        deleteButtonImg.src = "./assets/icons/poubelle.svg";
        deleteButtonImg.setAttribute('alt', "effacer");
        deleteButton.appendChild(deleteButtonImg);
    
        const itemImg = document.createElement("img");
        itemImg.src = work.imageUrl;
        itemImg.setAttribute('alt', work.title);

        itemContainer.appendChild(deleteButton);
        itemContainer.appendChild(itemImg);

        return itemContainer;
    }

    modalCloseButton.addEventListener("click", () => toggleModal(modalContainer, false));

    editionButton.addEventListener("click", () => {
        const isFilled = fillModalGallery();

        if (isFilled) {
            toggleModal(modalContainer, true);
        } else {
            console.error("Une erreur est survenue lors de l'affichage des travaux dans la gallerie");
        }
    })

    addWorkButton.addEventListener("click", () => {
        toggleModal(modalContainer, false);
        toggleModal(addWorkModalContainer, true)
    });

    // Add work modal

    addWorkModalCloseButton.addEventListener("click", () => toggleModal(addWorkModalContainer, false));
    returnToEditionModalButton.addEventListener("click", () => {
        toggleModal(addWorkModalContainer, false);
        toggleModal(modalContainer, true)
    });
}