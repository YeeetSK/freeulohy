const datePicker = document.getElementById('date-picker');
const classSelector = document.getElementById('class-selector');
const submitButton = document.getElementById('submit-button');
const imageContainer = document.getElementById('image-container');

let isFullscreen = false; // Track whether an image is already in fullscreen mode

// Define the homework images data structure
const homeworkImages = {
  '2024-09-25': {
    'sj': [],
    'matika': ['matika-domaca.jpg'],
    'dejepis': [],
    'technika': [],
    'informatika': [],
    'obcianka': [],
    'aj': [],
    'fyzika': [],
    'vv': [],
    'chemia': [],
    'biologia': [],
    'geografia': [],
  }
  // Add new days and classes here
};

// Populate the class selector with classes from the first day
const firstDay = Object.keys(homeworkImages)[0];
const classes = Object.keys(homeworkImages[firstDay]);
classes.forEach((className) => {
  const option = document.createElement('option');
  option.value = className;
  option.textContent = className;
  classSelector.appendChild(option);
});

submitButton.addEventListener('click', () => {
  const selectedDate = datePicker.value;
  const selectedClass = classSelector.value;
  getHomeworkImages(selectedDate, selectedClass);
});

function getHomeworkImages(date, className) {
  imageContainer.innerHTML = ''; // Clear existing images
  if (!homeworkImages[date]) {
    const noImagesMessage = document.createElement('p');
    noImagesMessage.textContent = `Žiadné domáce neboli pridané na tento deň`;
    imageContainer.appendChild(noImagesMessage);
  } else {
    const images = homeworkImages[date][className];
    if (images) {
      images.forEach((image) => {
        const img = document.createElement('img');
        img.src = `images/${className}/${date}/${image}`; // Directly use the real image source
        img.classList.add('thumbnail'); // Add a class for styling
        img.style.width = '200px'; // Set image width
        img.style.height = '200px'; // Set image height
        img.style.objectFit = 'cover'; // Scale image to fit container
        img.style.borderRadius = '10px'; // Add border radius
        imageContainer.appendChild(img);
      });
      addImageClickEventListeners();
    } else {
      console.log(`Žiadné domáce neboli pridané na tento deň ${date} ${className}`);
    }
  }
}

function addImageClickEventListeners() {
  const images = imageContainer.children;
  Array.prototype.forEach.call(images, (image) => {
    if (image.tagName === 'IMG') {
      image.addEventListener('click', () => {
        if (!isFullscreen) { // Allow image clicks without password check
          enterFullscreen(image);
        }
      });
    }
  });
}

function enterFullscreen(image) {
  isFullscreen = true; // Mark that we're in fullscreen mode
  
  const fullscreenImage = document.createElement('div');
  fullscreenImage.className = 'fullscreen-image';
  
  const fullscreenImg = document.createElement('img');
  fullscreenImg.src = image.src;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  
  fullscreenImage.appendChild(fullscreenImg);
  fullscreenImage.appendChild(closeButton); // Add the close button next to the image
  
  document.body.appendChild(fullscreenImage);
  
  // Add close button and ESC key functionality
  addFullscreenCloseEventListeners(fullscreenImage);
}

function addFullscreenCloseEventListeners(fullscreenImage) {
  const closeButton = fullscreenImage.querySelector('.close-button');

  // Close the fullscreen image on X button click
  closeButton.addEventListener('click', () => {
    exitFullscreen(fullscreenImage);
  });

  // Close the fullscreen image when clicking outside the image
  fullscreenImage.addEventListener('click', (event) => {
    if (event.target === fullscreenImage) {
      exitFullscreen(fullscreenImage);
    }
  });

  // Close the fullscreen image on ESC key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isFullscreen) {
      exitFullscreen(fullscreenImage);
    }
  });
}

function exitFullscreen(fullscreenImage) {
  fullscreenImage.remove();  // Remove the fullscreen image element
  isFullscreen = false;      // Reset the fullscreen flag
}
