$(document).ready(function() {
    // Sample JSON data
    const sampleJSON = [
      {
        "id": "c0ac49c5-871e-4c72-a878-251de465e6b4",
        "type": "input",
        "label": "Name",
        "placeholder": "Enter your name"
      },
      {
        "id": "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        "type": "select",
        "label": "Country",
        "options": ["India", "USA", "Australia"]
      },
      {
        "id": "45002ecf-85cf-4852-bc46-529f94a758f5",
        "type": "input",
        "label": "Email",
        "placeholder": "Enter your email"
      },
      {
        "id": "680cff8d-c7f9-40be-8767-e3d6ba420952",
        "type": "textarea",
        "label": "Description",
        "placeholder": "Enter a description"
      }
    ];
  
    // Function to render form elements from JSON
    function renderFormElements(jsonData) {
      $('#form-container').empty();
      jsonData.forEach((element) => {
        let formElement;
        if (element.type === 'input') {
          formElement = `
            <div class="form-element" data-id="${element.id}" data-type="input">
              <label contenteditable="true">${element.label}</label>
              <input type="text" placeholder="${element.placeholder}">
              <button class="delete-button">Delete</button>
            </div>`;
        } else if (element.type === 'select') {
          const options = element.options.map(option => `<option>${option}</option>`).join('');
          formElement = `
            <div class="form-element" data-id="${element.id}" data-type="select">
              <label contenteditable="true">${element.label}</label>
              <select>
                ${options}
              </select>
              <button class="edit-options-button">Edit Options</button>
              <button class="delete-button">Delete</button>
            </div>`;
        } else if (element.type === 'textarea') {
          formElement = `
            <div class="form-element" data-id="${element.id}" data-type="textarea">
              <label contenteditable="true">${element.label}</label>
              <textarea placeholder="${element.placeholder}"></textarea>
              <button class="delete-button">Delete</button>
            </div>`;
        }
        $('#form-container').append(formElement);
      });
    }
  
    // Initialize sortable functionality (drag-and-drop)
    $("#form-container").sortable({
      handle: ".form-element",
      placeholder: "sortable-placeholder"
    });
  
    // Render the form elements from the sample JSON
    renderFormElements(sampleJSON);
  
    // Add Input Field
    $('#add-input').click(function() {
      const newId = generateUUID();
      const inputElement = `
        <div class="form-element" data-id="${newId}" data-type="input">
          <label contenteditable="true">New Input Label</label>
          <input type="text" placeholder="Enter text here">
          <button class="delete-button">Delete</button>
        </div>`;
      $('#form-container').append(inputElement);
    });
  
    // Add Select Field
    $('#add-select').click(function() {
      const newId = generateUUID();
      const selectElement = `
        <div class="form-element" data-id="${newId}" data-type="select">
          <label contenteditable="true">New Select Label</label>
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
          <button class="edit-options-button">Edit Options</button>
          <button class="delete-button">Delete</button>
        </div>`;
      $('#form-container').append(selectElement);
    });
  
    // Add Textarea Field
    $('#add-textarea').click(function() {
      const newId = generateUUID();
      const textareaElement = `
        <div class="form-element" data-id="${newId}" data-type="textarea">
          <label contenteditable="true">New Textarea Label</label>
          <textarea placeholder="Enter text here"></textarea>
          <button class="delete-button">Delete</button>
        </div>`;
      $('#form-container').append(textareaElement);
    });
  
    // Delete form element
    $('#form-container').on('click', '.delete-button', function() {
      $(this).closest('.form-element').remove();
    });
  
    // Edit Select Options
    $('#form-container').on('click', '.edit-options-button', function() {
      const formElement = $(this).closest('.form-element');
      const select = formElement.find('select');
      const currentOptions = [];
      select.find('option').each(function() {
        currentOptions.push($(this).text());
      });
      openModal(currentOptions, function(updatedOptions) {
        // Update select options
        select.empty();
        updatedOptions.forEach(option => {
          select.append(`<option>${option}</option>`);
        });
      });
    });
  
    // Save Form and log JSON data
    $('#save-form').click(function() {
      const formData = [];
  
      $('#form-container .form-element').each(function() {
        const elementType = $(this).data('type');
        const label = $(this).find('label').text().trim();
        const id = $(this).data('id');
  
        let formElement = {
          id: id,
          type: elementType,
          label: label
        };
  
        if (elementType === 'input') {
          const placeholder = $(this).find('input').attr('placeholder');
          formElement.placeholder = placeholder;
        } else if (elementType === 'select') {
          const options = [];
          $(this).find('select option').each(function() {
            options.push($(this).text());
          });
          formElement.options = options;
        } else if (elementType === 'textarea') {
          const placeholder = $(this).find('textarea').attr('placeholder');
          formElement.placeholder = placeholder;
        }
  
        formData.push(formElement);
      });
  
      console.log("Saved Form JSON:", JSON.stringify(formData, null, 2));  // Log the updated JSON
      alert("Form configuration has been logged to the console.");
    });
  
    // Modal functionality
    const modal = $('#option-modal');
    const closeButton = $('.close-button');
    let currentOptionCallback = null;
  
    function openModal(options, callback) {
      $('#options-container').empty();
      options.forEach(option => {
        addOptionField(option);
      });
      currentOptionCallback = callback;
      modal.show();
    }
  
    function closeModal() {
      modal.hide();
      currentOptionCallback = null;
    }
  
    function addOptionField(optionText = '') {
      const optionItem = `
        <div class="option-item">
          <input type="text" value="${optionText}" placeholder="Option text">
          <button class="remove-option">Remove</button>
        </div>`;
      $('#options-container').append(optionItem);
    }
  
    // Open modal on edit-options-button click
    $('#form-container').on('click', '.edit-options-button', function() {
      const formElement = $(this).closest('.form-element');
      const select = formElement.find('select');
      const currentOptions = [];
      select.find('option').each(function() {
        currentOptions.push($(this).text());
      });
      openModal(currentOptions, function(updatedOptions) {
        // Update select options
        select.empty();
        updatedOptions.forEach(option => {
          select.append(`<option>${option}</option>`);
        });
      });
    });
  
    // Close modal when clicking on the close button
    closeButton.click(function() {
      closeModal();
    });
  
    // Close modal when clicking outside the modal content
    $(window).click(function(event) {
      if ($(event.target).is(modal)) {
        closeModal();
      }
    });
  
    // Add new option in modal
    $('#add-option').click(function() {
      addOptionField();
    });
  
    // Remove option in modal
    $('#options-container').on('click', '.remove-option', function() {
      $(this).closest('.option-item').remove();
    });
  
    // Save options from modal
    $('#option-modal').on('keypress', 'input', function(e) {
      if (e.which === 13) { // Enter key
        e.preventDefault();
        const options = [];
        $('#options-container input').each(function() {
          const val = $(this).val().trim();
          if (val) {
            options.push(val);
          }
        });
        if (currentOptionCallback) {
          currentOptionCallback(options);
        }
        closeModal();
      }
    });
  
    $('#option-modal').on('click', '.modal-button', function() {
      const options = [];
      $('#options-container input').each(function() {
        const val = $(this).val().trim();
        if (val) {
          options.push(val);
        }
      });
      if (currentOptionCallback) {
        currentOptionCallback(options);
      }
      closeModal();
    });
  
    // Utility function to generate UUID
    function generateUUID() { // Public Domain/MIT
      var d = new Date().getTime();//Timestamp
      var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
        } else {
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
        }
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
      });
    }
  });
  