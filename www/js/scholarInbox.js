
var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {

        $("#home_footer").load('footer.html', function(){$(this).trigger("create")});

    }
};

app.initialize();

function loadPageConfig() {
    checkUserValidationToken();
    fillScholarInbox();
}

function fillScholarInbox()
{
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});

    $.ajax({ type: "post",
        url: mySvcUrl+getScholarInbox_commanName,
        async:true,
        data:paramsStr,
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        cache: false,
        error: function(a,b,c) {
            alert("Error with Server ."+a);
        },
        success: function(data) {
            var serverDataObject = JSON.parse(data);
            if(serverDataObject.ResponseMessage_status_code == VALID_OPERATION)
            {
                var reqLst_inbox = serverDataObject.reqLst;
                console.log(reqLst_inbox);
                var reqDataList="<ul data-role=\"listview\" class=\"ui-listview\">";
                reqLst_inbox.forEach(function(obj)
                {
                     reqDataList=reqDataList+
                        "<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\"" +
                        " data-wrapperels=\"div\" data-icon=\"arrow-l\" data-iconpos=\"left\" data-theme=\"c\" class=\"ui-btn ui-btn-icon-left ui-li-has-arrow ui-li ui-first-child ui-btn-up-c\"><div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">" +
                        "<a href=\"#\"  onclick='openRequest("+obj.REQ_ID+")' class=\"ui-link-inherit\">" +
                         " [ "+ obj.REQ_TYPE_title+" "+obj.GRADE_TYPE_title+" "+obj.EXT_PERIOD+"]"+
                        "</a>" +
                        "</div><span class=\"ui-icon ui-icon-arrow-l ui-icon-shadow\">&nbsp;</span></div></li>";
                });
                reqDataList=reqDataList+"</ul>";
                $( reqDataList ).appendTo( "#content_inbox" );
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                navigator.notification.alert(
                   msg,
                    function (data) {  },         // callback
                    'رسالة تنبيه',            // title
                    'حسنا'                  // buttonName
                );
            }
        }
    });
}
function openRequest(reqid)
{
    localStorage.setItem(reqScholarExtIDKey,reqid);
    navigateUrl(5);
}