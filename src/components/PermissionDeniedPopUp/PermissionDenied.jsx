import Swal from 'sweetalert2';

function PermissionDenied() {
    Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
    
        confirmButtonText: 'OK',
        confirmButtonColor: '#000'
    });
}
export default PermissionDenied