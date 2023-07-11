$(document).ready(function () {
    /**
     * @description: Join exam
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('#joinExam').click(async function () {
        await Swal.fire({
            title: 'Join Exam',
            html:
                '<input id="examCode" class="swal2-input" placeholder="Exam Code">' +
                '<input id="password" class="swal2-input" placeholder="Exam Password">',
            customClass: 'swal2-container-custom',
            focusConfirm: true,
            preConfirm: async () => {
                const examCode = $('#examCode').val();
                const password = $('#password').val();
                if (!examCode) {
                    Swal.showValidationMessage(`Exam code is required!`);
                    $('#examCode').focus();
                } else {
                    const data = {
                        examCode: examCode,
                        password: password,
                    };
                    const result = await fetch(
                        `${window.apiUrl}/Exam/JoinExam`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${window.accessToken}`,
                            },
                            body: JSON.stringify(data),
                        }
                    );
                    const response = await result.json();
                    if (response.success) {
                        window.location.href = '/Exam/Index';
                    } else {
                        Swal.showValidationMessage(`${response.message}`);
                    }
                }
            },
            showCancelButton: true,
            confirmButtonText: 'Join',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
        });
    });

    /**
     * @description: Start exam
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('.startExam').click(async function () {
        var examId = $(this).data('examid');
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "Once you start the exam, you accept the exam's rules and regulations!",
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            showCancelButton: true,
            confirmButtonText: 'Start',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        if (confirm.isConfirmed) {
            const result = await fetch(`${window.apiUrl}/exam/startexam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.accessToken}`,
                },
                body: examId,
            });
            const response = await result.json();
            if (response.success) {
                window.location.href =
                    '/Exam/ExamDetail?examDetailId=' + examId;
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            }
        }
    });
});
