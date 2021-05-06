$(function () {
    let user = location.href.split("=")[1];
    //console.log(user);
    $("#user").text(user);
    $(".quit").click(function () {
        localStorage.removeItem("Token");
        $(location).prop("href", "login.html");
    })
    //发布图片预览
    $('#previewImg').on('change',function(){
        var c_showImg =this.files[0];
        getObjectURL(c_showImg);
        
    })

    function getObjectURL(file) {
        var url = null;
        if(window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if(window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if(window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        $("#imghead").prop("src", url);
        // $('.imghead').css("background-image","url("+url+")");
        // $('.imghead').css("background-size","100% 100%")
        return url;
    }
    //提交图片
    $("#tijiaotupian").click(function () {
        $("#progress").css('display', 'block');
        if (!localStorage.getItem("Token")) {
            alert("您尚未登录");
            $(location).prop("href", "login.html");
        }
        var formData = new FormData();
        formData.append('file', $('#previewImg')[0].files[0]);
        $.ajax({
            url: "http://wbc-api.lyleshaw.com/v1/api/files",  
            // header: {
            //     Authorization: localStorage.getItem("Token")
            // },
            data:formData,
            type: 'POST',
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem("Token"));
            },
            success: function (data) {
                if (data.code == 1001) {
                    alert("您尚未登录");
                    $(location).prop("href", "login.html");
                }
                $("#progress").css('display', 'none').children().css('width','0');
                //console.log(data);
                $("#showimg").prop("src",data.data);
            },
            xhr:function() {
                var xhr = new XMLHttpRequest();
                 //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                xhr.upload.addEventListener('progress', function (e) {
                    var progressRate = (e.loaded / e.total) * 100 + '%';
                    $('#progress').children("div").css('width', progressRate);
                })
                return xhr;
            },
            error: function (data) {
                //console.log(data);
                if (data.status == 502) {
                    alert("服务器繁忙，请稍后再试");
                } else if (data.status == 422) {
                    alert("文件上传有误");
                } else {
                    alert(data.status + "错误");
                }
                $("#progress").css('display', 'none').children().css('width','0');
            }
        });
    })
    
})