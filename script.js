const datePicker = document.getElementById('date-picker');
const classSelector = document.getElementById('class-selector');
const submitButton = document.getElementById('submit-button');
const imageContainer = document.getElementById('image-container');
// Create the password input field
const passwordInput = document.createElement('input');
passwordInput.type = 'password';
passwordInput.placeholder = 'Enter password to view images';
passwordInput.style.width = '250px';
passwordInput.style.height = '30px';
passwordInput.style.padding = '10px 40px 10px 20px'; // Add padding to the left to make room for the eye icon
passwordInput.style.borderRadius = '5px';
passwordInput.style.border = '2px solid #666'; // Dark gray border
passwordInput.style.background = '#333'; // Dark gray background
passwordInput.style.color = '#fff'; // White text
passwordInput.style.fontFamily = 'Arial, sans-serif'; // Set the font family to Arial
passwordInput.style.fontSize = '16px'; // Set the font size to 16px

// Create the eye icon
const eyeIcon = document.createElement('i');
eyeIcon.className = 'fas fa-eye';
eyeIcon.style.cursor = 'pointer';
eyeIcon.style.position = 'absolute';
eyeIcon.style.top = '50%'; // Move the eye icon to the middle of the input field
eyeIcon.style.transform = 'translateY(-50%)'; // Adjust the position to be perfectly centered
eyeIcon.style.right = '20px'; // Move the eye icon to the left
eyeIcon.style.fontSize = '20px'; // Make the eye icon slightly bigger

// Add event listener to the eye icon
eyeIcon.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.className = 'fas fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    eyeIcon.className = 'fas fa-eye';
  }
});

// Create a container for the input field and eye icon
const passwordContainer = document.createElement('div');
passwordContainer.style.position = 'relative';
passwordContainer.appendChild(passwordInput);
passwordContainer.appendChild(eyeIcon);
document.body.appendChild(passwordContainer);


const password = 'ZdarmaPristup'; // Set the password here

let isFullscreen = false; // Track whether an image is already in fullscreen mode
let isUnlocked = false; // Track whether the password has been entered correctly

// Define the homework images data structure
const homeworkImages = {
  '2024-09-24': {
    'sj': [],
    'matika': [],
    'dejepis': [],
    'technika': [],
    'informatika': [],
    'obcianka': [],
    'aj': ['ajpz2.jpg'],
    'fyzika': [],
    'vv': [],
    'chemia': [],
    'biologia': [],
    'geografia': [],
  },
  '2024-09-25': {
    'sj': ['sj.jpg', 'ajpz2.jpg'],
    'matika': [],
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
    noImagesMessage.textContent = `No images added for this day`;
    imageContainer.appendChild(noImagesMessage);
  } else {
    const images = homeworkImages[date][className];
    if (images) {
      images.forEach((image) => {
        const img = document.createElement('img');
        img.src = 'images/locked.jpg'; // Use a lock image as a placeholder
        img.classList.add('thumbnail'); // Add a class for styling
        img.style.width = '200px'; // Set image width
        img.style.height = '200px'; // Set image height
        img.style.objectFit = 'cover'; // Scale image to fit container
        img.style.borderRadius = '10px'; // Add border radius
        img.dataset.realSrc = `images/${className}/${date}/${image}`; // Store the real image source in a data attribute
        imageContainer.appendChild(img);
      });
      addImageClickEventListeners();
    } else {
      console.log(`No images found for ${date} ${className}`);
    }
  }
}

function addImageClickEventListeners() {
  const images = imageContainer.children;
  Array.prototype.forEach.call(images, (image) => {
    if (image.tagName === 'IMG') {
      image.addEventListener('click', () => {
        if (!isFullscreen && isUnlocked) { // Only allow image clicks if password is entered correctly
          enterFullscreen(image);
        }
      });
    }
  });
}

function checkPassword() {
  const enteredPassword = passwordInput.value;
  if (enteredPassword === password) {
    isUnlocked = true;
    const images = imageContainer.children;
    Array.prototype.forEach.call(images, (image) => {
      image.src = image.dataset.realSrc; // Replace the lock image with the real image
    });
    // alert('Password correct!');
    passwordInput.value = ''; // Clear the input box
  } else {
    alert('Incorrect password!');
  }
}

passwordInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    checkPassword();
  }
});

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
  
  document .body.appendChild(fullscreenImage);
  
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