import Swal from 'sweetalert2';

// Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const showSuccess = (message) => {
  Toast.fire({
    icon: 'success',
    title: message
  });
};

export const showError = (message) => {
  Toast.fire({
    icon: 'error',
    title: message
  });
};

export const showWarning = (message) => {
  Toast.fire({
    icon: 'warning',
    title: message
  });
};

export const showInfo = (message) => {
  Toast.fire({
    icon: 'info',
    title: message
  });
};

// Confirm dialog
export const confirmDelete = async (itemName = 'this item') => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${itemName}. This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e94560',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });
  return result.isConfirmed;
};

export default { showSuccess, showError, showWarning, showInfo, confirmDelete };
