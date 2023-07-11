$(document).ready(function () {
    /**
     * @description: change password
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $("#btnChangePassword").click(async function () {
        const htmlChangePassword = ` <div class="row g-3">
            <div class="col-md-12">
                <label for="oldPassword" class="form-label">Old password *</label>
                <input type="password" class="form-control" id="oldPassword">
            </div>

            <div class="col-md-6">
                        <label for="newPassword" class="form-label">New password *</label>
                <input type="password" class="form-control" id="newPassword">
            </div>

            <div class="col-md-6">
                        <label for="confirmPassword" class="form-label">Confirm Password *</label>
                <input type="password" class="form-control" id="confirmPassword">
            </div>
        </div>`;
        const { value: formValues } = await Swal.fire({
            title: "Change password",
            html: htmlChangePassword,
            focusConfirm: false,
            preConfirm: async () => {
                let isValid = true;
                const oldPassword = Swal.getPopup().querySelector("#oldPassword").value;
                const newPassword = Swal.getPopup().querySelector("#newPassword").value;
                const confirmPassword =
                    Swal.getPopup().querySelector("#confirmPassword").value;
                if (!oldPassword || !newPassword || !confirmPassword) {
                    isValid = false;
                    Swal.showValidationMessage(`Please enter all fields`);
                }
                if (
                    newPassword.length < 6 ||
                    confirmPassword.length < 6 ||
                    oldPassword.length < 6
                ) {
                    isValid = false;
                    Swal.showValidationMessage(`Password must be at least 6 characters`);
                }
                if (newPassword !== confirmPassword) {
                    isValid = false;
                    Swal.showValidationMessage(
                        `New password and confirm password not match`
                    );
                }
                if (isValid) {
                    const data = {
                        oldPassword,
                        newPassword,
                    };
                    const result = await fetch(
                        `${window.apiUrl}/account/changepassword`,
                        {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${window.accessToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        }
                    );
                    if (result.status !== 200) {
                        Swal.showValidationMessage(`Change password failed`);
                    }
                    const response = await result.json();
                    if (response.success === false) {
                        Swal.showValidationMessage(response.message);
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Change password success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                }
            },
            showCancelButton: true,
        });
    });

    /**
     * @description: update information
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $("#btnUpdateInfo").click(async function () {
        const htmlUpdateInfo = `<div class="row g-3">
            <div class="col-md-6">
                <label for="fullname" class="form-label">Full Name *</label>
                <input type="text" class="form-control" id="fullname" value="${userInfo.fullName}">
            </div>

            <div class="col-md-6">
                <label for="phone" class="form-label">Phone *</label>
                <input type="text" class="form-control" id="phone" value="${userInfo.phone}">
            </div>

            <div class="col-12">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" value="${userInfo.address}">
            </div>
        </div>`;

        const { value: formValues } = await Swal.fire({
            title: "Update information",
            html: htmlUpdateInfo,
            preConfirm: async () => {
                let isValid = true;
                const fullname = Swal.getPopup().querySelector("#fullname").value;
                const phone = Swal.getPopup().querySelector("#phone").value;
                const address = Swal.getPopup().querySelector("#address").value;

                if (!fullname || !phone) {
                    isValid = false;
                    Swal.showValidationMessage(`Please enter all fields required`);
                    return;
                }

                const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                if (!regexPhone.test(phone)) {
                    isValid = false;
                    Swal.showValidationMessage(`Phone number is invalid`);
                    return;
                }

                if (isValid) {
                    const data = {
                        fullname,
                        phone,
                        address,
                    };

                    const result = await fetch(`${window.apiUrl}/account`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${window.accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });

                    if (result.status !== 200) {
                        Swal.showValidationMessage(`Update information failed`);
                    }

                    const response = await result.json();

                    if (response.success === false) {
                        Swal.showValidationMessage(response.message);
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Update information success",
                            showConfirmButton: false,
                            timer: 1000,
                        }).then(() => {
                            fetch(`/Account/RefreshToken`, {
                                method: "POST",
                            }).then((response) => {
                                if (response.status === 200) {
                                    location.reload();
                                }
                            });
                        });
                    }
                }
            },
            showCancelButton: true,
        });
    });

    /**
     * @description: delete user
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $("#btnDeleteUser").click(function () {
        Swal.fire({
            title: "Confirmation",
            text: "Once deleted, you will not be able to recover this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "No, cancel",
            focusCancel: true,
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await fetch(`${window.apiUrl}/account`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${window.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const response = await result.json();
                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "User has been deleted successfully!",
                    }).then((value) => {
                        window.location.href = "/Account/Logout";
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.message,
                    });
                }
            }
        });
    });
});
