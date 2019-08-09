// 操作用户
var userAry = new Array();

// 将用户列表展示

$.ajax({
    type: 'get',
    url: '/users',
    success: function(res) {
        userAry = res;
        render(userAry)
    }
})

// 调用template方法
function render(arr) {
   var str = template('userTpl',{
        list:arr
    });
    $('tbody').html(str);
}


// 添加用户功能
$('#userAdd').on('click',function(){
    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function(res) {
            userAry.push(res);
            render(userAry);
        }
    });
});


//提交图片

$('#avatar').on('change',function(){
    // 用户选择到的文件
    //this.files[0]
    var formData = new FormData();
    formData.append('avatar',this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉ajax方法不要解析请求参数
        processData: false,
        // 告诉ajax方法不要设置请求参数的类型
        contentType: false,
        success: function(response) {
            // console.log(response); 
            $('#preview').attr('src', response[0].avatar);
            $('#hiddenAvatar').val(response[0].avatar)
        }
    })
});

var userId;
// 编辑用户功能

$('tbody').on('click','.edit',function(){
    // 保存当前被修改的这个用户的id
    userId = $(this).parent().attr('data-id');
    // console.log(user);
    

    $('#userForm > h2').text('修改用户');

    // 先获取当前这个元素的祖先tr
    var trObj = $(this).parents('tr');

    // 获取图片的地址
    var imgsrc = trObj.children().eq(1).children('img').attr('src');
    // 将图片c的地址写入到隐藏域
    $('#hiddenAvatar').val(imgsrc);
    // 如果imgsrc有值
    if(imgsrc) {
        $('#preview').attr('src',imgsrc);
    }else {
        $('#preview').attr('src','../img/default.png');
    }


   
    // 将对应的内容写到左边的输入框
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    var status = trObj.children().eq(4).text();
    // console.log(status);
    if(status == '激活') {
        $('#jh').prop('checked',true);
    }else {
        $('#wjh').prop('checked',true);
    }

    var role = trObj.children().eq(5).text();
    // console.log(role);
    if(role == '超级管理员') {
        $('#admin').prop('checked',true);
    }else {
        $('#normal').prop('checked', true);
    }
    // 当我们点击编辑按钮时 将添加按钮隐藏 同时将修改按钮 显示出来 
    $('#userAdd').hide();
    $('#userEdit').show();
    
});


// 完成修改用户功能
$('#userEdit').on('click',function(){
    // console.log($('#userForm').serialize());
    // 发送ajax请求传递id
    $.ajax({
        type: 'put',
        url: '/users/'+userId,
        data:$('#userForm').serialize(),
        success: function(res) {
            // 将数据库里的数据修改 先将userAry这个数组里面的元素给修改
            // 将要修改的元素从userAry这个数组里找出来
            var index = userAry.findIndex(it =>it._id == userId);
            // 根据这个index找到数组的这个元素 把它的数据更新
            userAry[index] = res;
            // 渲染页面
            render(userAry);
        }
    });
    
});

