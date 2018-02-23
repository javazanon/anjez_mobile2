var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
    }
};

app.initialize();
function loadPageConfig()
{
    checkUserValidationToken();
    var content;
    $.get('menu_nav.html', function(data){
        content= data;
        $( content ).appendTo('#menu_container').trigger('create')
       // alert(content);
    });


    $("#home_footer").load('footer.html', function(){$(this).trigger("create")});
    loadEmpInfo();
    loadscreenAllowed();
}
function loadscreenAllowed()
{
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});
    $.ajax({ type: "post",
        url: mySvcUrl+getAllowScreen_commanName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            alert("Error with Server ."+a);
        },
        success: function(data) {
            console.log("Data From Sever : "+data);
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                console.log("reterive screen allowed");
                console.log("----------------------------------------------------------------");
               console.log(serverDataObject.allowedScreen);
                console.log("----------------------------------------------------------------");
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                alert(msg);
            }
        }
    });
}
function checkUserValidationToken()
{
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});
    $.ajax({ type: "post",
        url: mySvcUrl+checkTokenValidation_commandName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            alert("Error with Server ."+a);
            window.location = "login.html";
        },
        success: function(data) {
            console.log("Data From Sever : "+data);
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == SERVICE_TOKEN_NOT_VALID_CODE)
            {
                window.location = "login.html";
            }
        }
    });
}
function loadEmpInfo() {
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});
    $.ajax({ type: "post",
        url: mySvcUrl+getCurrentUserInfo_commandName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            alert("Error with Server ."+a);
        },
        success: function(data) {
            console.log("Data From Sever : "+data);
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                document.getElementById("lbl_emp_name").innerHTML=serverDataObject.userFullName;
                document.getElementById("lbl_emp_status").innerHTML=serverDataObject.emp_status_name;
                document.getElementById("lbl_emp_email").innerHTML=serverDataObject.email;
                document.getElementById("lbl_emp_mobile").innerHTML=serverDataObject.mobile;
                document.getElementById("lbl_emp_site").innerHTML=serverDataObject.emp_site_name;
                document.getElementById("lbl_emp_sect").innerHTML=serverDataObject.emp_sect_name;
                document.getElementById("lbl_job_name").innerHTML=serverDataObject.emp_job_name;
                document.getElementById("lbl_nationality_name").innerHTML=serverDataObject.emp_nationality;
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                alert(msg);
            }
        }
    });
}
