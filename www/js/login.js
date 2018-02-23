var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btn_checklogin").addEventListener("click",checkLogin );
    },
    onDeviceReady: function() {
        autoLoginCheck();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

app.initialize();

function autoLoginCheck()
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
            navigator.notification.alert(
                'فشل الاتصال بالسرفر ',  // message
                function (data) {  },         // callback
                'رسالة تنبيه',            // title
                'حسنا'                  // buttonName
            );
        },
        success: function(data) {
            console.log("Data From Sever : "+data);
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == TOKENUSER_VALID_PARAM_CODE)
            {
                window.location = "home.html";
            }
        }
    });
}

function checkLogin()
{

  if(document.getElementById("txt-UserName").value.length==0)
  {


      navigator.notification.alert(
          'اسم المستخدم ناقص',  // message
          function (data) {  },         // callback
          'رسالة تنبيه',            // title
          'حسنا'                  // buttonName
      );
  }
  else  if(document.getElementById("txt-password").value.length == 0)
  {
      navigator.notification.alert(
          'كلمة المرور ناقصة ',  // message
          function (data) {  },         // callback
          'رسالة تنبيه',            // title
          'حسنا'                  // buttonName
      );
  }
  else
  {
      var fullTodayDate =getTodayDate();
      var fullTokenKey = tokenSystem+fullTodayDate;
      var hashedSecurityToken = generateHASHKey(fullTokenKey);
      var paramDataJson = {
          "token": hashedSecurityToken,
          "userName": document.getElementById("txt-UserName").value,
          "password": document.getElementById("txt-password").value
      };
      var paramsStr = JSON.stringify(paramDataJson);

      $.ajax({ type: "post",
          url: mySvcUrl+checkLogin_commandName,
          async:true,
          data:paramsStr,
          contentType: "application/json;charset=utf-8;",
          dataType: "json",
          cache: false,
          error: function(a,b,c) {
              navigator.notification.alert(
                  'فشل الاتصال بالسرفر ',  // message
                  function (data) {  },         // callback
                  'رسالة تنبيه',            // title
                  'حسنا'                  // buttonName
              );
          },
          success: function(data) {
              console.log("Data From Sever : "+data);
              var serverDataObject = JSON.parse(data);
              if(serverDataObject.ResponseMessage_status_code == SUCCEED_LOGIN_CODE)
              {
                  var userGUIDKey = serverDataObject.ResponseMessage_value;
                  localStorage.setItem(anjezMobileUserKey,userGUIDKey);
                  window.location.replace("home.html");
              }
              else
              {
                  var msg = serverDataObject.ResponseMessage_status_message;
                  navigator.notification.alert(
                     msg,  // message
                      function (data) {  },         // callback
                      'رسالة تنبيه',            // title
                      'حسنا'                  // buttonName
                  );
              }
          }
      });
  }


}

