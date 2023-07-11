/**
 * @description: function to delete exam
 * @param: {any}
 * Author: AnhDV 07/07/2023
 */
async function DeleteExam(examId) {
    if (!examId) return;
    const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    });
    if (confirm) {
        const result = await fetch(
            `${window.apiUrl}/exam/DeleteExam?examId=${examId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${window.accessToken}`,
                },
            }
        );
        const response = await result.json();
        if (response.success) {
            Swal.fire(
                'Deleted!',
                'Your exam has been deleted.',
                'success'
            ).then(() => {
                let table = $('.table-custom').DataTable();
                table
                    .row($(`tr[data-id=${examId}]`))
                    .remove()
                    .draw();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
            });
        }
    }
}
/**
 * @description: function to set show/hide score
 * @param: {any}
 * Author: AnhDV 07/07/2023
 */
async function QuickSetShowHideScore(examId) {
    const tr = $(`tr[data-id=${examId}]`);
    if (tr.length === 0) return;
    const checkbox = tr.find('input[name=isShowScore]');
    if (checkbox.length === 0) return;
    const data = {
        examId: examId,
        isShowScore: !checkbox.prop('checked'),
    };
    const result = await fetch(`${window.apiUrl}/exam/ChangeShowHideScore`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${window.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await result.json();
    if (response.success) {
        checkbox.prop('checked', !checkbox.prop('checked'));
        const a = tr.find('a[name=quickSetShowHideScore]');
        if (a.length === 0) return;
        a.text(data.isShowScore ? 'Hide Score' : 'Show Score');
        Swal.fire('Success!', 'Your setting has been changed.', 'success');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
        });
    }
}

/**
 * @description: function to set password
 * @param: {any}
 * Author: AnhDV 07/07/2023
 */
async function QuickSetPassword(examId) {
    const tr = $(`tr[data-id=${examId}]`);
    if (tr.length === 0) return;
    const checkbox = tr.find('input[name=isShowPassword]');
    if (checkbox.length === 0) return;
    await Swal.fire({
        title: 'Set Password',
        input: 'password',
        inputLabel: 'Password',
        inputPlaceholder: 'Enter password',
        inputAttributes: {
            autocomplete: 'new-password',
        },
        preConfirm: async (password) => {
            const data = {
                examId: examId,
                password: password,
            };
            const result = await fetch(
                `${window.apiUrl}/exam/ChangeExamPassword`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${window.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            const response = await result.json();
            if (response.success) {
                Swal.fire(
                    'Success!',
                    'Your password has been changed.',
                    'success'
                ).then(() => {
                    if (password.length > 0) {
                        checkbox.prop('checked', true);
                    } else {
                        checkbox.prop('checked', false);
                    }
                    const a = tr.find('a[name=quickSetPassword]');
                    if (a.length === 0) return;
                    a.text(
                        password.length > 0 ? 'Change Password' : 'Set Password'
                    );
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                });
            }
        },
    });
}
