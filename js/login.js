document.querySelector('.img__btn').addEventListener('click', function() {
    document.querySelector('.content').classList.toggle('s--signup');
})
$(function () {
    let checkRule = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-9])\d{8}$/
    $('#registerPhone,#loginPhone').on("change", function () {
        let value = $(this).val();
        if (!checkRule.test(value)) {
            alert("您输入的手机号码格式错误");
        }
    });
    $('#login').on('click', function () {
        let phone = $('#loginPhone').val();
        let pwd = $('#loginPwd').val();
        function getToken(){
            　　if(!!localStorage.getItem('Token')){
            　　　　return localStorage.getItem('Token');
            　　}
            　　return '';//如果获取不到token就发送null给服务器端
            }
        let data = {
            "phone": phone,
            "password": pwd
        };
        $.ajax({
            type: 'POST',
            // headers: { 
            //     Accept: "application/json;charset=utf-8", 
            //     userToken: "" + getToken()
            // },
            url: 'http://43575728-1286728693454693.test.functioncompute.com/v1/api/users/login',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                // console.log(data);
                // console.log(data.data.user_token);
                if (data.code == 200) {
                    localStorage.setItem('Token', data.data.user_token);
                    //$.cookie('token', data.data.user_token);
                    alert('登录成功');
                    $(location).prop("href", "index.html?user="+phone);
                } else {
                    alert(data.detail);
                }
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
            error: function (response) {
                //console.log(response);
                let error = response.status;
                if (error == 502)
                    alert('服务器繁忙，请稍后重新登录')
                else {
                    //console.log(response);
                    alert(error+'错误')
                }
            }
        })
    })
    $('#register').on('click', function(){
        let phone = $('#registerPhone').val();
        let username = $('#registerUsername').val();
        let pwd = $('#registerPwd').val();
        let sex = $("input[name='sex']:checked").val();
        let data = {
            "sex":parseInt(sex),
            "name": username,
            "password": pwd,
            "phone": phone,
        }
        $.ajax({
            type: 'POST',
            url: 'http://43575728-1286728693454693.test.functioncompute.com/v1/api/users/register',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function () {
                alert('注册成功');
            },
            // xhr:function() {
            //     var xhr = new XMLHttpRequest();
            //      //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
            //     xhr.upload.addEventListener('progress', function (e) {
            //         var progressRate = (e.loaded / e.total) * 100 + '%';
            //         $('.progress').children("div").css('width', progressRate);
            //     })
            //     return xhr;
            // },
            error: function(){
                alert('注册失败, 请重新注册');
            }
        })
    })
})
