$(document).ready(function () {
    /**
     * @description: format thời gian
     * @param: {any}
     * Author: AnhDV 12/07/2023
     */
    var formatTime = function (time) {
        var currentDate = new Date(time);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1; // Tháng tính từ 0 - 11, nên cần cộng thêm 1
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();

        // Đảm bảo các số đơn vị có 2 chữ số bằng cách thêm số 0 vào trước (nếu cần)
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        year = year.toString().slice(-2); // Lấy 2 chữ số cuối của năm

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var formattedDateTime =
            day +
            '/' +
            month +
            '/' +
            year +
            ' ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds;
        return formattedDateTime;
    };

    /**
     * @description: Xử lý signalR
     * @param: {any}
     * Author: AnhDV 12/07/2023
     */
    if (window.apiSignalRUrl && window.accessToken) {
        window.gradingSignalRConnection = new signalR.HubConnectionBuilder()
            .withUrl(window.apiSignalRUrl, {
                accessTokenFactory: () => window.accessToken,
            })
            .build();

        gradingSignalRConnection
            .start()
            .then(function () {
                console.log('SignalR Started...');
                // lấy tên màn hình hiện tại
                let screenName = window.location.pathname.split('/').pop();

                if (screenName === 'ExamDetail') {
                    gradingSignalRConnection.on(
                        'UpdateExamToClients',
                        function (value) {
                            // nếu admin update exam thì thông báo reload lại trang
                            Swal.fire({
                                title: 'Warning!',
                                text: 'Exam has been updated by admin, please reload page!',
                                icon: 'warning',
                                confirmButtonText: 'OK',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            }).then((value) => {
                                location.reload();
                            });
                        }
                    );

                    gradingSignalRConnection.on(
                        'ReceiveMessage',
                        function (item) {
                            // nếu admin nhắn tin thì hiển thị thông báo
                            item = JSON.parse(item);
                            $.toast({
                                heading: `Message from ${item.SenderName}`,
                                text: item.Message,
                                showHideTransition: 'slide',
                                icon: 'warning',
                                position: 'top-right',
                                hideAfter: false,
                            });
                        }
                    );
                }

                if (screenName === 'ExamManagementResult') {
                    var createMessageHtml = (item) => {
                        return `<div class="chat-message" data-value="${
                            item.Id
                        }">
                            <span class="chat-message-name">${
                                item.SenderName
                            }</span>
                            <div class="chat-message-body">
                                <span class="chat-message-text">${
                                    item.Message
                                }</span>
                                <span class="chat-message-time">${formatTime(
                                    item.CreatedDate
                                )}</span>
                            </div>
                            <div class="chat-message-action">
                                <button class="btn btn-danger btn-sm btnDeleteMessage" data-value="${
                                    item.Id
                                }"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>`;
                    };

                    $(document).on('click', '.btnDeleteMessage', function () {
                        let messageId = $(this).data('value');
                        gradingSignalRConnection
                            .invoke('DeleteMessage', messageId)
                            .then(() => {
                                $(
                                    `.chat-message[data-value=${messageId}]`
                                ).remove();
                            })
                            .catch(function (err) {
                                return console.error(err);
                            });
                    });

                    var totalConnection = 0;
                    gradingSignalRConnection
                        .invoke('GetListUserConnection', jsonData.examId)
                        .then(function (res) {
                            // lấy số lượng kết nối hiện tại
                            let result = JSON.parse(res);
                            totalConnection = result.length;
                            $('#totalConnection').text(totalConnection);
                        })
                        .catch(function (err) {
                            return console.error(err);
                        });

                    gradingSignalRConnection
                        .invoke('GetMessageFromGroup', jsonData.examId)
                        .then(function (res) {
                            // lấy danh sách tin nhắn
                            let result = JSON.parse(res);
                            result.forEach((item) => {
                                let html = createMessageHtml(item);
                                $('#chatContent').append(html);
                            });
                        });

                    // chatContent, btnSendChat, chatMessage
                    $('#btnSendChat').click(function () {
                        let message = $('#chatMessage').val();
                        if (message) {
                            gradingSignalRConnection
                                .invoke(
                                    'SendMessageToGroup',
                                    jsonData.examId,
                                    $('#chatMessage').val()
                                )
                                .then(function (res) {
                                    // nếu gửi tin nhắn thành công thì hiển thị tin nhắn
                                    // clear chat message
                                    $('#chatMessage').val('');
                                })
                                .catch(function (err) {
                                    return console.error(err);
                                });
                        }
                    });

                    gradingSignalRConnection.on(
                        'ReceiveAdminMessage',
                        function (res) {
                            // nếu admin nhắn tin thì hiển thị thông báo
                            let result = JSON.parse(res);
                            let html = createMessageHtml(result);
                            $('#chatContent').append(html);
                        }
                    );

                    gradingSignalRConnection.on(
                        'StudentJoinGroup',
                        function (res, screenName) {
                            // nếu có sinh viên join group thì tăng số lượng kết nối
                            res = JSON.parse(res);
                            if (screenName[0] === 'ExamDetail') {
                                totalConnection++;
                                $('#totalConnection').text(totalConnection);
                            }
                        }
                    );

                    gradingSignalRConnection.on(
                        'StudentLeaveGroup',
                        function (res, screenName) {
                            console.log(res, screenName, 'leave group');
                            if (screenName[0] === 'ExamDetail') {
                                // nếu có sinh viên leave group thì giảm số lượng kết nối
                                totalConnection--;
                                $('#totalConnection').text(totalConnection);
                            }
                        }
                    );
                }
            })
            .catch(function (err) {
                return console.error(err);
            });
    }
    /**
     * @description: function to selected option in select tag
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('.va-select option').each(function () {
        if ($(this).data('value') == $(this).parent().data('selected')) {
            $(this).attr('selected', 'selected');
        }
    });

    /**
     * @description: function to show mark log
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('.viewMarkLog').click(function () {
        const normalizeMarkLog = (jsonData) => {
            let questionId = jsonData.QuestionId,
                testCaseId = jsonData.TestCaseId,
                inputValue = jsonData.InputValue,
                expectedValue = jsonData.ExpectedValue,
                yourOutput = jsonData.YourOutput,
                time = jsonData.Time,
                score = jsonData.Score,
                exception = jsonData.Exception;

            // create html table tr and td
            let tableHTML = `<table class='table table-bordered'>`;
            tableHTML += '<tr>';
            tableHTML += '<th>Question Id</th>';
            tableHTML += '<td>' + questionId + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Test Case Id</th>';
            tableHTML += '<td>' + testCaseId + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Input Value</th>';
            tableHTML += '<td>' + inputValue + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Expected Value</th>';
            tableHTML += '<td>' + expectedValue + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Your Output</th>';
            tableHTML += '<td>' + yourOutput + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Time</th>';
            tableHTML += '<td>' + time + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Score</th>';
            tableHTML += '<td>' + score + '</td>';
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            tableHTML += '<th>Exception</th>';
            tableHTML += '<td>' + exception + '</td>';
            tableHTML += '</tr>';
            tableHTML += '</table>';
            return tableHTML;
        };
        var logs = $(this).data('value');
        var tableHTML = `<table class='table table-bordered'>`;
        tableHTML += '<tr>';
        Object.keys(logs[0]).forEach(function (key) {
            tableHTML += '<th>' + key + '</th>';
        });
        tableHTML += '</tr>';
        logs.forEach(function (log) {
            tableHTML += '<tr>';
            if (log.hasOwnProperty('MarkTime')) {
                log.MarkTime = formatTime(log.MarkTime);
            }
            Object.values(log).forEach(function (value) {
                tableHTML +=
                    '<td>' +
                    (typeof value === 'object'
                        ? normalizeMarkLog(value)
                        : value) +
                    '</td>';
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</table>';

        let container = `<div style='overflow: auto; max-height: 650px;'>`;
        container += tableHTML;
        container += `</div>`;

        Swal.fire({
            title: 'Mark Log',
            html: container,
            width: 'auto',
        });
    });

    /**
     * @description: function to create datatable
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('.table-custom').DataTable({
        paging: true,
        ordering: true,
        info: true,
        lengthChange: false,
        pageLength: 10,
        searching: true,
        order: [[0, 'desc']],
        language: {
            search: 'Search',
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Export to Excel',
                className: 'btn btn-success',
                exportOptions: {
                    columns: ':visible:not(.noExport)',
                },
            },
            {
                extend: 'pdfHtml5',
                text: 'Export to PDF',
                className: 'btn btn-danger',
                exportOptions: {
                    columns: ':visible:not(.noExport)',
                },
            },
        ],
    });

    /**
     * @description: function to download material
     * @param: {any}
     * Author: AnhDV 07/07/2023
     */
    $('.downloadMaterial').click(async function () {
        var downloadLink = $(this).data('link');
        const result = await fetch(
            `${window.apiUrl}/exam/downloadfile?fileName=${downloadLink}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.accessToken}`,
                },
            }
        );
        if (result.status === 401) {
            Swal.fire({
                title: 'Error!',
                text: 'You are not authorized!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (
            result.headers &&
            result.headers.get('Content-Type') &&
            result.headers.get('Content-Type').includes('application/json')
        ) {
            const response = await result.json();
            Swal.fire({
                title: 'Error!',
                text: response.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } else {
            const resultBlob = await result.blob();
            const url = window.URL.createObjectURL(resultBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadLink.split('\\').pop());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
    });
});
