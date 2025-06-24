import { isLoggedIn, apiBaseUrl, sessionToken, works, workCategories, displayWorks } from "./script.js";

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
            const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer cette photo ?");
            if (isConfirmed) {
                fetch(`${apiBaseUrl}/works/${work.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionToken}`
                    }
                }).then(() => {
                    works.splice(works.indexOf(work), 1);
                    displayWorks(works);
                    itemContainer.remove();
                })
            }
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
        fillCategorySelect();
    });

    // Add work modal

    addWorkModalCloseButton.addEventListener("click", () => toggleModal(addWorkModalContainer, false));
    returnToEditionModalButton.addEventListener("click", () => {
        toggleModal(addWorkModalContainer, false);
        toggleModal(modalContainer, true)
        clearForm();
    });

    const categorySelect = document.getElementById("category");


    const fillCategorySelect = () => {
        const categories = workCategories;

        const categoryOptions = categories.map(category => ({
            value: category.id,
            label: category.name
        }));

        categorySelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Sélectionner une catégorie";
        categorySelect.appendChild(defaultOption);

        categoryOptions.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            categorySelect.appendChild(opt);
        });
    };

    // Formulaire
    const data = {
        image: null,
        title: "",
        category: null
    }

    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("category");

    const modalFormHeaderContent = document.querySelector(".modal-form-header-content");
    const modalFormHeaderContentCopy = modalFormHeaderContent.cloneNode(true);

    const validationButton = document.getElementById("validButton");

    const addWorkErrorMessage = document.getElementById("addWordErrorMessage");

    const handleChange = (key, value) => {
        data[key] = value;

        if (data.title.length && data.image && data.category) {
            if (validationButton.getAttribute("disabled")) {
                validationButton.removeAttribute("disabled");
            }
        } else {
            if (!validationButton.getAttribute("disabled")) {
                validationButton.setAttribute("disabled", true);
            }
        }
    }

    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        // Si l'image est supérieur à 4Mo ou n'est pas de type jpg / png alors on affiche l'erreur
        const maxSize = 4194304;

        addWorkErrorMessage.style.display = "none";
        addWorkErrorMessage.textContent = "";

        if (file.size > maxSize) {
            addWorkErrorMessage.style.display = "block";
            addWorkErrorMessage.textContent = "La taille de votre image est supérieure à 4Mo";
            return;
        }

        if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
            addWorkErrorMessage.style.display = "block";
            addWorkErrorMessage.textContent = "Veuillez sélectionner une image de type JPG ou PNG";
            return;
        }

        handleChange("image", file);

        modalFormHeaderContent.innerHTML = "";
        modalFormHeaderContent.classList.add("selected");
        modalFormHeaderContent.parentElement.classList.add("selected");

        const imagePreview = document.createElement("img");
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.setAttribute("alt", "image preview");

        modalFormHeaderContent.appendChild(imagePreview);
    });

    titleInput.addEventListener("keyup", (event) => handleChange("title", event.target.value));

    categoryInput.addEventListener("change", (event) => handleChange("category", event.target.value));

    const clearForm = () => {
        data.image = null;
        data.title = "";
        data.category = null;

        modalFormHeaderContent.classList.remove("selected");
        modalFormHeaderContent.parentElement.classList.remove("selected");
        modalFormHeaderContent.innerHTML = modalFormHeaderContentCopy.innerHTML;

        validationButton.setAttribute("disabled", true);

        imageInput.value = "";
        titleInput.value = "";
        categoryInput.value = "";

        addWorkErrorMessage.style.display = "none";
        addWorkErrorMessage.textContent = "";
    }

    const addWorkForm = document.getElementById("addWorkForm");

    addWorkForm.addEventListener("submit", (event) => {
        event.preventDefault();

        addWorkErrorMessage.style.display = "none";
        addWorkErrorMessage.textContent = "";

        if (!data.image) {
            addWorkErrorMessage.style.display = "block";
            addWorkErrorMessage.textContent = "Veuillez sélectionner une image pour votre photo";
            return;
        }

        if (!data.title.length) {
            addWorkErrorMessage.style.display = "block";
            addWorkErrorMessage.textContent = "Veuillez entrer un titre pour votre photo";
            return;
        }

        if (!data.category || !data.category.length) {
            addWorkErrorMessage.style.display = "block";
            addWorkErrorMessage.textContent = "Veuillez sélectionner une catégorie pour votre photo";
            return;
        }

        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("title", data.title);
        formData.append("category", data.category);

        fetch(`${apiBaseUrl}/works`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionToken}`
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                clearForm();
            } else {
                addWorkErrorMessage.style.display = "block";
                addWorkErrorMessage.textContent = "Une erreur est survenue lors de l'ajout de votre photo";
            }
        }).finally(() => {
            toggleModal(addWorkModalContainer, false);
            displayWorks(null, true);
        })

    });

}