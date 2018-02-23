

var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var fileDeviceDir="";
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btn_upload_file").addEventListener('click',uploadFile , false);
    },
    onDeviceReady: function() {
        var devicePlatform = device.platform;
        if(devicePlatform == 'iOS'){
            fileDeviceDir =  cordova.file.dataDirectory;
        }else{
            fileDeviceDir  =  cordova.file.externalRootDirectory;
        }
    }
};
app.initialize();

function fillPage() {
    checkUserValidationToken();
    fillrequestAttachONServer();
    var reqID = localStorage.getItem(reqScholarExtIDKey);
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({
        "GUIDToken":anjezMobileUserKey_param ,
        "reqID":reqID
        });

    $.ajax({ type: "post",
        url: mySvcUrl+getScholarRequestByID_commanName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
           ERROR_CONNECT_TO_SERVER(a,b,c);
        },
        success: function(data) {
            var serverDataObject = JSON.parse(data);
            console.log(serverDataObject);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                document.getElementById("REQ_ID").innerText=serverDataObject.REQ_ID;
                document.getElementById("GRADE_TYPE_title").innerText=serverDataObject.GRADE_TYPE_title;
                document.getElementById("EXT_PERIOD").innerText=serverDataObject.EXT_PERIOD;
                document.getElementById("START_DATE").innerText=serverDataObject.START_DATE;
                document.getElementById("REQ_TYPE_title").innerText=serverDataObject.REQ_TYPE_title;
                var scholarallowedAttachsList = serverDataObject.allowedAttachs;
                scholarallowedAttachsList.forEach(function(obj)
                {
                    $("#ddl_attach_1").append($("<option />").val(obj.value).text(obj.text));
                });
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                navigator.notification.alert(
                    msg,
                    function (data) {  },
                    'رسالة تنبيه',
                    'حسنا'
                );
            }
        }
    });
}

function fillrequestAttachONServer() {

    var reqID = localStorage.getItem(reqScholarExtIDKey);
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({
        "GUIDToken":anjezMobileUserKey_param ,
        "reqID":reqID,
        "stepID":"1"
    });

    $.ajax({ type: "post",
        url: mySvcUrl+getAttachForRequestByStepID_commanName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            ERROR_CONNECT_TO_SERVER(a,b,c);
        },
        success: function(data) {
            var serverDataObject = JSON.parse(data);
            console.log(serverDataObject);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                if(serverDataObject.allowedAttachs.length==0)
                {
                    var reqDataList="<ul data-role=\"listview\" class=\"ui-listview\">";
                    reqDataList=reqDataList+
                        "<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\"" +
                        " data-wrapperels=\"div\" data-icon=\"arrow-l\" data-iconpos=\"left\" data-theme=\"c\" class=\"ui-btn ui-btn-icon-left ui-li-has-arrow ui-li ui-first-child ui-btn-up-c\"><div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">" +
                        "<a href=\"#\"   class=\"ui-link-inherit\">" +
                        " [ لاتوجد  مرفقات مع الطلب]"+
                        "</a>" +
                        "</div><span class=\"ui-icon ui-icon-arrow-l ui-icon-shadow\">&nbsp;</span></div></li>";
                    reqDataList=reqDataList+"</ul>";
                    $( reqDataList ).appendTo( "#content_inbox" );
                }
                else
                {
                    var scholarallowedAttachsList = serverDataObject.allowedAttachs;
                    var reqDataList="<ul data-role=\"listview\" class=\"ui-listview\">";
                    scholarallowedAttachsList.forEach(function(obj)
                    {
                        reqDataList=reqDataList+
                            "<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\"" +
                            " data-wrapperels=\"div\" data-icon=\"arrow-l\" data-iconpos=\"left\" data-theme=\"c\" class=\"ui-btn ui-btn-icon-left ui-li-has-arrow ui-li ui-first-child ui-btn-up-c\"><div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">" +
                            "<a href=\"#\"  onclick='downloadattach("+obj.value+")' class=\"ui-link-inherit download_link_class\">" +
                            " [ "+ obj.text+"]"+
                            "</a>" +
                            "</div><span class=\"ui-icon ui-icon-arrow-l ui-icon-shadow\">&nbsp;</span></div></li>";
                    });
                    reqDataList=reqDataList+"</ul>";
                    $( reqDataList ).appendTo( "#content_inbox" );
                }
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                navigator.notification.alert(
                    msg,
                    function (data) {  },
                    'رسالة تنبيه',
                    'حسنا'
                );
            }
        }
    });
}
function uploadFile()
{
    if (document.getElementById("file1").files.length > 0) {
        if (document.getElementById("ddl_attach_1").selectedIndex > 0) {
            var ddl_attach_1_obj = document.getElementById("ddl_attach_1");
            var attachTypeParam_param = ddl_attach_1_obj.options[ddl_attach_1_obj.selectedIndex].value;
            var fileuploaded = document.getElementById("file1").files[0];
            var reqID_param = localStorage.getItem(reqScholarExtIDKey);
            var anjezMobileUserKey_param = localStorage.getItem(anjezMobileUserKey);
            var reader = new FileReader();
            reader.readAsDataURL(fileuploaded);
            reader.onload = function () {
                var dataNative = reader.result;

                var anjezMobileUserKey_param = localStorage.getItem(anjezMobileUserKey);
                var reqID_param = localStorage.getItem(reqScholarExtIDKey);
                var uri = encodeURI(mySvcUrl + uploadFileScholarWithBinary_commandName);
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileuploaded.name;
                options.mimeType = "application/pdf";

                var headers =
                    {
                        "GUIDToken": anjezMobileUserKey_param,
                        "reqID": reqID_param,
                        "attachType": attachTypeParam_param
                    };
                options.headers = headers;
                var ft = new FileTransfer();
                // alert("source : "+fileURL+" destination : "+uri)
                ft.upload(dataNative, uri, onSuccess, onError, options);

                function onSuccess(r) {
                    navigator.notification.alert(
                        'تم رفع الملف بنجاح',
                        function (data) {  },
                        'رسالة تنبيه',
                        'حسنا'
                    );
                    fillrequestAttachONServer();
                }

                function onError(error) {
                    navigator.notification.alert(
                        'خطأ فى تحميل الملف',
                        function (data) {  },
                        'رسالة تنبيه',
                        'حسنا'
                    );
                }
            };
            reader.onerror = function () {
                console.log('there are some problems');
            };

        }

        else
        {
            navigator.notification.alert(
                'برجاء اختيار نوع المرفق اولا',
                function (data) {  },
                'رسالة تنبيه',
                'حسنا'
            );
        }
    }
    else
    {
        navigator.notification.alert(
            'برجاء اختيار الملف اولا',
            function (data) {  },
            'رسالة تنبيه',
            'حسنا'
        );
    }

    return;
}
function downloadattach(attach_id) {
    alert("download attach file id :"+attach_id);
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
        alert('file system open: ' + fs.name);
        // Make sure you add the domain name to the Content-Security-Policy <meta> element.
        // Parameters passed to getFile create a new file or return the file if it already exists.
        fs.root.getFile('downloaded.pdf', { create: true, exclusive: false }, function (fileEntry) {
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(mySvcUrl + downloadattach_commandName);
            var anjezMobileUserKey_param = localStorage.getItem(anjezMobileUserKey);
            var reqID_param = localStorage.getItem(reqScholarExtIDKey);

            fileTransfer.download(
                uri,
                fileEntry,
                function(entry) {
                    navigator.notification.alert(
                        'تم تحميل الملف بنجاح'+entry.toURL(),
                        function (data) {  },
                        'رسالة تنبيه',
                        'حسنا'
                    );
                },
                function(error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code" + error.code);
                    navigator.notification.alert(
                        'فشلت عملية تحميل الملف من السرفر',
                        function (data) {  },
                        'رسالة تنبيه',
                        'حسنا'
                    );
                },
                true,
                {
                    headers: {
                        "GUIDToken": anjezMobileUserKey_param,
                        "reqID": reqID_param,
                        "attachID": attach_id
                    }
                }
            );
        }, function (error) { alert("error 1 :"+error) });

    }, function (fileError) { alert("error 2 : "+fileError) });
}
function downloadattach22222(attach_id) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(mySvcUrl + downloadattach_commandName);
    var anjezMobileUserKey_param = localStorage.getItem(anjezMobileUserKey);
    var reqID_param = localStorage.getItem(reqScholarExtIDKey);
    var randFileName = Math.floor(Math.random() * 1000);
    var fileEntry= fileDeviceDir+randFileName+".pdf";
    alert(" start download attach file id :"+attach_id +fileEntry);
    fileTransfer.download(
        uri,
        fileEntry,
        function(entry) {
            navigator.notification.alert(
                'تم تحميل الملف بنجاح'+entry.toURL(),
                function (data) {  },
                'رسالة تنبيه',
                'حسنا'
            );
        },
        function(error) {
            var msg=error.source+" - "+error.target+"-"+error.code;
            navigator.notification.alert(
                'فشلت عملية تحميل الملف من السرفر'+msg,
                function (data) {  },
                'رسالة تنبيه',
                'حسنا'
            );
        },
        false,
        {
            headers: {
                "GUIDToken": anjezMobileUserKey_param,
                "reqID": reqID_param,
                "attachID": attach_id
            }
        }
    );
}