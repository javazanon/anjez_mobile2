
var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
function loadPageConfig()
{
    $("#home_footer").load('footer.html', function(){$(this).trigger("create")});
    fillScholarInfo();
}
function fillScholarInfo()
{
    var anjezMobileUserKey_param =  localStorage.getItem(anjezMobileUserKey);
    var paramsStr = JSON.stringify({"GUIDToken":anjezMobileUserKey_param});

    $.ajax({ type: "post",
        url: mySvcUrl+getScholarInfo_commandName,
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
                document.getElementById("lbl_first_grade").innerHTML=serverDataObject.first_schol_stage_name;
                document.getElementById("lbl_first_schol_period_year").innerHTML=serverDataObject.first_schol_period_year;
                document.getElementById("lbl_first_general_speciality_name").innerHTML=serverDataObject.first_general_speciality_name;
                document.getElementById("lbl_first_minor_speciality_name").innerHTML=serverDataObject.first_minor_speciality_name;
                document.getElementById("lbl_first_site").innerHTML=serverDataObject.first_site;
                document.getElementById("lbl_first_schol_country_name").innerHTML=serverDataObject.first_schol_country_name;

                document.getElementById("lbl_last_grade").innerHTML=serverDataObject.last_schol_stage_name;
                document.getElementById("lbl_last_schol_period_year").innerHTML=serverDataObject.last_schol_period_year;
                document.getElementById("lbl_last_general_speciality_name").innerHTML=serverDataObject.last_general_speciality_name;
                document.getElementById("lbl_last_minor_speciality_name").innerHTML=serverDataObject.last_minor_speciality_name;
                document.getElementById("lbl_last_site").innerHTML=serverDataObject.last_site;
                document.getElementById("lbl_last_schol_country_name").innerHTML=serverDataObject.last_schol_country_name;


                document.getElementById("lbl_last_schol_education_hejri_year").innerHTML=serverDataObject.last_schol_education_hejri_year;
                document.getElementById("lbl_last_schol_start_date").innerHTML=serverDataObject.last_schol_start_date;
                document.getElementById("lbl_last_schol_end_date").innerHTML=serverDataObject.last_schol_end_date;
                document.getElementById("lbl_last_schol_period").innerHTML=serverDataObject.last_schol_period;
            }
            else
            {
                var msg = serverDataObject.ResponseMessage_status_message;
                alert(msg);
            }
        }
    });
}