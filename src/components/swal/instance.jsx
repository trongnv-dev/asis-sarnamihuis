import swalContent from 'sweetalert2-react-content';
import Swal from '@blueupcode/sweetalert2';

// Use SweetAlert React Content library
const ReactSwal = swalContent(Swal);

// Set SweetAlert options
const swal = ReactSwal.mixin({
  customClass: {
    confirmButton: 'btn btn-label-success btn-wide mx-1',
    cancelButton: 'btn btn-label-danger btn-wide mx-1',
  },
  buttonsStyling: false,
});

// Set SweetAlert toast options
const toast = ReactSwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', ReactSwal.stopTimer);
    toast.addEventListener('mouseleave', ReactSwal.resumeTimer);
  },
});

export { swal, toast };
