var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btn_sendScholarExtToServer").addEventListener("click",sendScholarExtToServer );
    },
    onDeviceReady: function() {
        checkUserValidationToken();
        fillPage();
        $("#home_footer").load('footer.html', function(){$(this).trigger("create")});

    },
    // Update DOM on a Received Event
};

app.initialize();
function fillPage()
{
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});
    $.ajax({
        type: "post",
        url: mySvcUrl + fillScholarExtReqData_commandName,
        async: true,
        data: paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function (a, b, c) {
            navigator.notification.alert(
                'خطأ الاتصال بالسرفر ',  // message
                function (data) {
                },         // callback
                'رسالة تنبيه',            // title
                'حسنا'                  // buttonName
            );
            alert("Error with Server ." + a);
        },
        success: function (data) {
            var serverDataObject = JSON.parse(data);
            if (serverDataObject.ResponseMessage_status_code == VALID_OPERATION) {

                var allowCreate = serverDataObject.allowCreateRequest;
                if (allowCreate == "0") {
                    navigator.notification.alert(
                        'غير مصرح لك بانشاء طلب تمديد ',  // message
                        function (data) {
                        },         // callback
                        'رسالة تنبيه',            // title
                        'حسنا'                  // buttonName
                    );
                    navigateUrl(6);
                    return;
                }


                var scholarList = serverDataObject.allowedGrade;
                scholarList.forEach(function (obj) {
                    $("#ddl_scholar_grade").append($("<option />").val(obj.value).text(obj.text));
                });
                document.getElementById("txt_tamdeed_count").value = serverDataObject.tamdeedCount;
                var scholarList = serverDataObject.allowedGrade;
                scholarList.forEach(function (obj) {
                    $("#ddl_scholar_grade").append($("<option />").val(obj.value).text(obj.text));
                });
                var scholarList = serverDataObject.allowedTakleef;
                scholarList.forEach(function (obj) {
                    $("#ddl_scholar_takleef").append($("<option />").val(obj.value).text(obj.text));
                });

                fillPageDates();
            }
            else {
                var msg = serverDataObject.ResponseMessage_status_message;
                navigator.notification.alert(
                    'فشل الاتصال بالسرفر ',  // message
                    function (data) {
                    },         // callback
                    'رسالة تنبيه',            // title
                    'حسنا'                  // buttonName
                );
            }
        }
    });
}



function fillPageDates()
{
    for (i = 1; i <= 30; i++) {
        var val = "";
        if(i<10)
        {
            val="0"+i;
        }
        $("#select_start_date_day").append($("<option />").val(val).text(i));
    }
    for (i = 1; i <= 12; i++) {
        if(i<10)
        {
            val="0"+i;
        }
        $("#select_start_date_month").append($("<option />").val(val).text(i));
    }
    for (i = 1439; i <= 1450; i++) {
        $("#select_start_date_year").append($("<option />").val(i).text(i));
    }
    for (i = 1; i <= 30; i++) {
        var val = "";
        if(i<10)
        {
            val="0"+i;
        }
        $("#select_period_date_day").append($("<option />").val(val).text(i));
    }
    for (i = 1; i <= 12; i++) {
        if(i<10)
        {
            val="0"+i;
        }
        $("#select_period_date_month").append($("<option />").val(val).text(i));
    }
    for (i = 1; i <= 15; i++) {
        if(i<10)
        {
            val="0"+i;
        }
        $("#select_period_date_year").append($("<option />").val(val).text(i));
    }
}




function sendScholarExtToServer() {

// start validation
    var ddl_select_start_date_day = document.getElementById("select_start_date_day");
    var ddl_select_start_date_month = document.getElementById("select_start_date_month");
    var ddl_select_start_date_year = document.getElementById("select_start_date_year");

    var start_data_param = ddl_select_start_date_day.options[ddl_select_start_date_day.selectedIndex].value+
            "-"+ ddl_select_start_date_month.options[ddl_select_start_date_month.selectedIndex].value+
            "-"+ ddl_select_start_date_year.options[ddl_select_start_date_year.selectedIndex].value;


    var ddl_select_period_date_day = document.getElementById("select_period_date_day");
    var ddl_select_period_date_month = document.getElementById("select_period_date_month");
    var ddl_select_period_date_year = document.getElementById("select_period_date_year");

    var period_data_param = ddl_select_period_date_day.options[ddl_select_period_date_day.selectedIndex].value+
        "-"+ ddl_select_period_date_month.options[ddl_select_period_date_month.selectedIndex].value+
        "-"+ ddl_select_period_date_year.options[ddl_select_period_date_year.selectedIndex].value;


    var e_grade = document.getElementById("ddl_scholar_grade");
    var grade_param = e_grade.options[e_grade.selectedIndex].value;

    var e_takleef = document.getElementById("ddl_scholar_takleef");
    var takleef_param = e_takleef.options[e_takleef.selectedIndex].value;
    var e_reason = document.getElementById("txt_reason").value;

    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
   // var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});

    var reqJson={
        "GUIDToken":anjezMobileUserKey_param,
        "start_data_param":start_data_param ,
        "period_data_param":period_data_param,
        "grade_param":grade_param,
        "takleef_param":takleef_param,
        "reason":e_reason
    };
    var paramsStr = JSON.stringify(reqJson);
    $.ajax({ type: "post",
        url: mySvcUrl+createScholarExtReq_commanName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            navigator.notification.alert(
                'خطأ الاتصال بالسرفر',
                function (data) {},
                'رسالة تنبيه',
                'حسنا'
            );
        },
        success: function(data) {
            console.log("Data From Sever : "+data);
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                // start upload file ......
                navigator.notification.alert(
                    serverDataObject.ResponseMessage_status_message,  // message
                    function (data) {
                    },         // callback
                    'رسالة تنبيه',            // title
                    'حسنا'                  // buttonName
                );
                navigateUrl(5);
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                alert(msg);
            }
        }
    });
}
