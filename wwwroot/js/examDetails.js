$(document).ready(function () {
    /**
     * @description: CONFIG SIGNALR HERE
     * @param: {any}
     * Author: AnhDV 09/07/2023
     */
    window.apiSignalRUrl = `https://localhost:44333/gradingsignalr?groupId=${examDetailObj.examId}&screen=ExamDetail&userId=${examDetailObj.userId}`;
    /**
     * @description: count down timer
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    if ($('#timer-container').length > 0) {
        let isCount = true;
        var startTime = new Date(examDetailObj.examStartTime);
        var endTime = new Date(examDetailObj.examEndTime);
        var currentTime = new Date();

        if (currentTime < startTime) {
            $('#timer').text('Not open yet');
            $('#timer-container').hide();
            isCount = false;
        }

        if (currentTime > endTime) {
            $('#timer').text('Time out');
            $('#timer-container').hide();
            isCount = false;
        }

        if (isCount) {
            $('#timer-container').show();
            var timer = setInterval(function () {
                currentTime = new Date();

                var remainingTime = endTime - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(timer);
                    document.getElementById('timer').innerHTML = 'Time out';
                    Swal.fire('Error!', 'Time out', 'error').then((value) => {
                        location.reload();
                    });
                    return;
                }

                var hours = Math.floor(remainingTime / (1000 * 60 * 60));
                var minutes = Math.floor(
                    (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
                );
                var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                document.getElementById('timer').innerHTML =
                    hours +
                    ' hours ' +
                    minutes +
                    ' minutes ' +
                    seconds +
                    ' seconds';
            }, 1000);
        }
    }

    /**
     * @description: function to submit exam
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('#submitExam').click(async function () {
        var file = $('#studentFileExam').prop('files')[0];
        var examId = `${examDetailObj.examId}`;
        if (file == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please choose file to submit!',
            });
            return;
        }
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to submit this exam?',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        if (confirm.isConfirmed) {
            var formData = new FormData();
            formData.append('files', file);
            formData.append('examId', examId);
            $('#loading').show();
            $('#submitExam').prop('disabled', true);
            const result = await fetch(`${window.apiUrl}/exam/submitexam`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${window.accessToken}`,
                },
                body: formData,
            });
            const response = await result.json();
            $('#loading').hide();
            $('#submitExam').prop('disabled', false);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                }).then((value) => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                });
            }
        }
    });
});
