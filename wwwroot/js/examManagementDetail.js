/**
 * @description: function to submit
 * @param: {any}
 * Author: AnhDV 07/07/2023
 */
async function submitForm(examId = null) {
    const requiredFields = $('.form-control[data-val-required]');
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        const value = $(field).val();
        if (!value) {
            const fieldName = $(field).attr('name');
            if (fieldName === 'QuestionFile' && examInfo.oldQuestionFileName) {
                continue;
            }
            if (fieldName === 'TestCaseFile' && examInfo.oldTestCaseFileName) {
                continue;
            }
            $(field).next().remove();
            $(field).addClass('border border-danger');
            $(field).after(
                `<span class="text-danger field-validation-valid" data-valmsg-for="${fieldName}" data-valmsg-replace="true">The ${fieldName} field is required.</span>`
            );
            return;
        } else {
            $(field).next().remove();
            $(field).removeClass('border border-danger');
        }
    }
    let result = null;
    if (!examId) {
        // add
        result = await fetch(`${window.apiUrl}/Exam/CreateExam`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${window.accessToken}`,
            },
            body: new FormData(document.getElementById('formData')),
        });
    } else {
        result = await fetch(
            `${window.apiUrl}/Exam/UpdateExam?examId=${examId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${window.accessToken}`,
                },
                body: new FormData(document.getElementById('formData')),
            }
        );
    }
    if (result) {
        const response = await result.json();
        if (response.success) {
            // đợi 2s chuyển trang
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your exam has been saved.',
            }).then((value) => {
                window.location.href = '/Exam/ExamManagement';
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
