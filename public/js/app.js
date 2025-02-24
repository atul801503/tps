// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  
  
  // delete popover
  document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const popover = document.getElementById('popover');
    let deleteIndex = null;
  
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            deleteIndex = event.target.dataset.index;
            popover.style.display = 'block';
        });
    });
  
    document.getElementById('confirm-delete').addEventListener('click', () => {
        if (deleteIndex !== null) {
            // Perform deletion logic (e.g., sending a request to the server)
            console.log(`Delete item at index: ${deleteIndex}`);
            popover.style.display = 'none';
            // For demo purposes, reload the page to show the item is deleted
            location.reload();
        }
    });
  
    document.getElementById('cancel-delete').addEventListener('click', () => {
        popover.style.display = 'none';
    });
  });