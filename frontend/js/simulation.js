 // Check login status
    function checkLoginStatus() {
      // In a real application, you would check if the user is logged in
      // For this demo, we'll create a simple session if none exists
      if (!localStorage.getItem('userSession')) {
        localStorage.setItem('userSession', JSON.stringify({
          username: 'demo_user',
          loggedIn: true,
          loginTime: new Date().toISOString()
        }));
      }
    }
    // Image data
    const imageFiles = [
      "2CH_801_7_thumb.jpg",
      "2CH_RT_1101_10_thumb.jpg",
      "3CH_1001_9_thumb.jpg",
      "4ch_701_6_thumb.jpg",
      "Axial_BB_edited_301_5_thumb.jpg",
      "Axial_stack_201_3_thumb.jpg",
      "EGE_2CH_2101_39_thumb.jpg",
      "EGE_3CH_2201_40_thumb.jpg",
      "EGE_4CH_2001_38_thumb.jpg",
      "EGE_SAX_1901_37_thumb.jpg",
      "eLGE_BASE_SAX_PSIR_TFE_3002_49_thumb.jpg",
      "LGE_2C_2601_43_thumb.jpg",
      "LGE_3C_2701_44_thumb.jpg",
      "LGE_4C_2501_42_thumb.jpg",
      "LGE_SAX_2401_41_thumb.jpg",
      "SA_901_8_thumb.jpg",
      "sTFE_GRID_BH_1201_11_thumb.jpg",
      "sTFE_GRID_BH_1301_12_thumb.jpg",
      "sTFE_GRID_BH_1401_13_thumb.jpg",
      "T1_enhanced_2801_45_thumb.jpg",
      "T1_enhanced_2801_46_thumb.jpg",
      "T1_native_1501_14_thumb.jpg",
      "T1_native_1501_15_thumb.jpg",
      "T2_MAPPING_1601_19_thumb.jpg",
      "rest_perfusion_test_1801_36_thumb.jpg"
    ];

    // Initialize images with default parameters
    const images = imageFiles.map((file, index) => ({
      id: `img-${index}`,
      name: file.replace("_thumb.jpg", "").replace(/_/g, " "),
      path: `/frontend/cardic/${file}`,
      parameters: {
        geometry: {
          fov: 250,
          matrixSize: "256×256",
          sliceThickness: 3,
          sliceGap: 0,
          planeOrientation: "Axial",
          foldoverDirection: "Left-Right"
        },
        sequence: {
          tr: 500,
          te: 20,
          flipAngle: 90,
          pulseSequence: "T1-Weighted"
        }
      }
    }));

    let currentIndex = 0;
    let selectedImageId = null;

    // DOM elements
    const imageViewer = document.getElementById('imageViewer');
    const sequenceList = document.getElementById('sequenceList');
    const parameterTitle = document.getElementById('parameterTitle');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotificationsBtn = document.getElementById('closeNotificationsBtn');
    const toggleSequenceBtn = document.getElementById('toggleSequenceBtn');
    const sequenceContent = document.getElementById('sequenceContent');
    const collapseIcon = document.getElementById('collapseIcon');
    const expandIcon = document.getElementById('expandIcon');
    const saveRunBtn = document.getElementById('saveRunBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const applyChangesBtn = document.getElementById('applyChangesBtn');

    // Tab elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Initialize the UI
    function init() {
      checkLoginStatus();
      renderImages();
      renderSequenceList();
      setupEventListeners();
    }

    // Render the current 3 images
    function renderImages() {
      imageViewer.innerHTML = '';
      
      const currentImages = images.slice(currentIndex, currentIndex + 3);
      
      if (currentImages.length === 0) {
        imageViewer.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">No images to display</div>';
        return;
      }
      
      currentImages.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.className = 'bg-white rounded-lg shadow overflow-hidden';
        imageCard.innerHTML = `
          <div class="image-container">
            <div class="image-label">${image.name}</div>
            <img src="${image.path}" alt="${image.name}" class="w-full h-full object-cover" onerror="this.src='/placeholder.svg?height=256&width=256'">
          </div>
          <div class="image-info">
            <div class="flex justify-between">
              <span>FOV: ${image.parameters.geometry.fov}mm</span>
              <span>Matrix: ${image.parameters.geometry.matrixSize}</span>
            </div>
            <div class="flex justify-between mt-1">
              <span>TR: ${image.parameters.sequence.tr}ms</span>
              <span>TE: ${image.parameters.sequence.te}ms</span>
            </div>
          </div>
        `;
        
        // Set the selected image when clicking on an image
        imageCard.addEventListener('click', () => {
          selectedImageId = image.id;
          updateParameterForm(image);
          parameterTitle.textContent = `Set Parameters - ${image.name}`;
        });
        
        imageViewer.appendChild(imageCard);
      });
      
      // Set the first image as selected by default
      if (currentImages.length > 0 && !selectedImageId) {
        selectedImageId = currentImages[0].id;
        updateParameterForm(currentImages[0]);
        parameterTitle.textContent = `Set Parameters - ${currentImages[0].name}`;
      }
    }

    // Render the sequence list
    function renderSequenceList() {
      sequenceList.innerHTML = '';
      
      images.forEach((image, index) => {
        const isActive = index >= currentIndex && index < currentIndex + 3;
        const isGroupStart = index % 3 === 0;
        
        const listItem = document.createElement('li');
        listItem.className = `sequence-item ${isActive ? 'active' : ''} ${isGroupStart && isActive ? 'active-group' : ''}`;
        listItem.innerHTML = `
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${isActive ? 'text-blue-500' : 'text-gray-500'}">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span class="text-sm font-medium">${image.name}</span>
          </div>
          <div class="flex items-center gap-2">
            ${isActive ? `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
            <span class="text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${index % 2 === 0 ? '04m 30s' : '03m 45s'}
            </span>
          </div>
        `;
        
        listItem.addEventListener('click', () => {
          // Update to show the group of 3 images starting at the clicked index
          // Make sure the index is a multiple of 3
          currentIndex = Math.floor(index / 3) * 3;
          selectedImageId = null; // Reset selected image
          renderImages();
          renderSequenceList();
        });
        
        sequenceList.appendChild(listItem);
      });
    }

    // Update the parameter form with the selected image's parameters
    function updateParameterForm(image) {
      // Geometry parameters
      document.getElementById('fov').value = image.parameters.geometry.fov;
      document.getElementById('matrixSize').value = image.parameters.geometry.matrixSize;
      document.getElementById('sliceThickness').value = image.parameters.geometry.sliceThickness;
      document.getElementById('sliceGap').value = image.parameters.geometry.sliceGap;
      document.getElementById('planeOrientation').value = image.parameters.geometry.planeOrientation;
      document.getElementById('foldoverDirection').value = image.parameters.geometry.foldoverDirection;
      
      // Sequence parameters
      document.getElementById('tr').value = image.parameters.sequence.tr;
      document.getElementById('te').value = image.parameters.sequence.te;
      document.getElementById('flipAngle').value = image.parameters.sequence.flipAngle;
      document.getElementById('pulseSequence').value = image.parameters.sequence.pulseSequence;
    }

    // Get parameters from the form
    function getParametersFromForm() {
      return {
        geometry: {
          fov: Number(document.getElementById('fov').value),
          matrixSize: document.getElementById('matrixSize').value,
          sliceThickness: Number(document.getElementById('sliceThickness').value),
          sliceGap: Number(document.getElementById('sliceGap').value),
          planeOrientation: document.getElementById('planeOrientation').value,
          foldoverDirection: document.getElementById('foldoverDirection').value
        },
        sequence: {
          tr: Number(document.getElementById('tr').value),
          te: Number(document.getElementById('te').value),
          flipAngle: Number(document.getElementById('flipAngle').value),
          pulseSequence: document.getElementById('pulseSequence').value
        }
      };
    }

    // Save parameters for the selected image
    function saveParameters() {
      if (!selectedImageId) return;
      
      const parameters = getParametersFromForm();
      
      // Update the image parameters
      images.forEach(image => {
        if (image.id === selectedImageId) {
          image.parameters = parameters;
        }
      });
      
      // Re-render the images to show updated parameters
      renderImages();
    }

    // Setup event listeners
    function setupEventListeners() {
      // Tab switching
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Show corresponding tab content
          tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}Tab`) {
              content.classList.add('active');
            }
          });
        });
      });
      
      // Toggle notification panel
      notificationBtn.addEventListener('click', () => {
        notificationPanel.classList.toggle('show');
      });
      
      // Close notification panel
      closeNotificationsBtn.addEventListener('click', () => {
        notificationPanel.classList.remove('show');
      });
      
      // Toggle sequence list
      toggleSequenceBtn.addEventListener('click', () => {
        const isCollapsed = sequenceContent.classList.contains('hidden');
        if (isCollapsed) {
          sequenceContent.classList.remove('hidden');
          collapseIcon.classList.remove('hidden');
          expandIcon.classList.add('hidden');
        } else {
          sequenceContent.classList.add('hidden');
          collapseIcon.classList.add('hidden');
          expandIcon.classList.remove('hidden');
        }
      });
      
      // Save and run button
      saveRunBtn.addEventListener('click', () => {
        saveParameters();
        alert('Sequence saved and running!');
      });
      
      // Logout button
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          // Clear any stored user data
          localStorage.removeItem('userSession');
          sessionStorage.clear();
          
          // Show logout message
          const logoutMessage = document.createElement('div');
          logoutMessage.className = 'fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2';
          logoutMessage.textContent = 'Logging out...';
          document.body.appendChild(logoutMessage);
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            // In a real application, redirect to login page
            // window.location.href = 'login.html';
            
            // For this demo, just reload the page to simulate logout
            window.location.reload();
          }, 1500);
        }
      });
      
      // Apply changes button
      applyChangesBtn.addEventListener('click', () => {
        saveParameters();
        alert('Parameters applied successfully!');
      });
      
      // Close notification panel when clicking outside
      document.addEventListener('click', (event) => {
        if (!notificationBtn.contains(event.target) && !notificationPanel.contains(event.target)) {
          notificationPanel.classList.remove('show');
        }
      });
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', init);