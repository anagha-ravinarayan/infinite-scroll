const imageContainer = document.getElementById("image-container");
const loader = document.getElementById('loader');

// Unsplash API
const countParam = 30;
const apiKey = UNSPLASH_API_ACCESS_KEY;     // from env.js
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${countParam}`;

let readyToLoadNewImages = false;
let imagesLoaded = 0;
let totalImagesToLoad = 0;
let apiPhotos = [];

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImagesToLoad) {
        loader.hidden = true;       // Will be false only on initial load, coz of infinite scroll
        readyToLoadNewImages = true;
    }
}

// Set attributes to HTML elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Display photos by creating HTML elements
function displayPhotos() {
    totalImagesToLoad += apiPhotos.length;
    apiPhotos.forEach(photo => {

        // Create Link to Unsplash website
        const link = document.createElement('a');
        setAttributes(link, {
            href: photo.links.html,
            target: '_blank'        // Opens in new tab
        });

        // Create Image element
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // Check if all images have loaded
        img.addEventListener('load', imageLoaded);

        // Add <img> inside <a>, and both inside image-container
        link.appendChild(img);
        imageContainer.appendChild(link);
    });
}

// Get photos from Unsplash API
async function getPhotosFromAPI() {
    try {
        const response = await fetch(apiUrl);
        apiPhotos = await response.json();
        displayPhotos();
    } catch (error) {
        console.log('Error in fetching images from Unsplash API', error);
    }
}


// Check to see if scrolling near the bottom of the page, and load more photos
window.addEventListener('scroll', () => {
    if (readyToLoadNewImages && (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000)) {
        readyToLoadNewImages = false;
        getPhotosFromAPI();
    }
})

// On Load
getPhotosFromAPI();