$('#inpUsername').blur(function() {
    $('#inpUsername').removeClass("focus");
    $('.fa-user').css('color', 'white')
    $('.user').css('border-color', 'white')
})
.focus(function() {
    $(this).addClass("focus")
    $('.fa-user').css('color', '#1063ac')
    $('.user').css('border-color', '#1063ac')
});

$('#inpPass').blur(function() {
    $('#inpPass').removeClass("focus");
    $('.fa-key').css('color', 'white')
    $('.pass').css('border-color', 'white')
})
.focus(function() {
    $(this).addClass("focus")
    $('.fa-key').css('color', '#1063ac')
    $('.pass').css('border-color', '#1063ac')
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});

let showPass = 0;
$('#btn-show-pass').on('click', function(){
    if(showPass == 0) {
        $('#inpPass').attr('type','text');
        $(this).find('i').removeClass('fa-eye');
        $(this).find('i').addClass('fa-eye-slash').css('color', '#337ab7');
        showPass = 1;
    }
    else {
        $('#inpPass').attr('type','password');
        $(this).find('i').removeClass('fa-eye-slash');
        $(this).find('i').addClass('fa-eye').css('color', '#c2c7d0');
        showPass = 0;
    }
    
});


$('#submit-btn').click(function(){
    
    // const username = $('#inpUsername').val()
    // const password = $('#inpPass').val()
    const username = 'admin'
    const password = 'admin'

    if (username === "") {
        $("#valid-user").show()
        $("#submit-btn").css("margin-top", "5px")
    } else {
        $("#valid-user").hide()
        if (password === "") {
            $("#valid-pass").show()
            $("#submit-btn").css("margin-top", "5px")
        } else {
            $("#valid-pass").hide()
            $('#submit-btn').html(`<i class="fas fa-circle-notch fa-spin"></i>`)

            $.ajax({
                url: '/login/verify',
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: (result)=>{
                    // console.log(result);
                    if (result.code == 200) {
                        localStorage.setItem('last_user', username)
                        localStorage.setItem('last_pass', password)
                        window.location.href='/home'
                        // console.log('Success login');
                    } else if (result.code == 400){
                        // console.log('Gagal Login');
                        $("#valid-login").css("display", "inline").show()
                        setTimeout(()=>{
                            $("#valid-login").css("display", "none").fadeOut(4000)
                        }, 3000)
                        $("#submit-btn").css("margin-top", "5px")
                        $('#submit-btn').html(`Login`)
                    }
                }
            })
        }
    }
})


$('#inpPass').on("input", function(){
    let username = $('#inpUsername').val()
    let password = $('#inpPass').val()
    if(username == ''){
        console.log('username, password kosong');
    } else {
        $.ajax({
            url: '/login/verify',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: (result)=>{
                if (result.code == 200) {
                    localStorage.setItem('last_user', username)
                    localStorage.setItem('last_pass', password)
                    $('#submit-btn').html(`<i class="fas fa-circle-notch fa-spin"></i>`)
                    setTimeout(function(){
                        window.location.href='/home'
                    },2000)
                    setTimeout(()=>{
                        $('#submit-btn').html(`Login`)
                    }, 5000)
                }
            }
        })
    }
})

let user = localStorage.getItem('last_user')
let pass = localStorage.getItem('lass_pass')

if (!$('#inpUsername').val() || $('#inpUsername').val() == '') {
    $('#inpUsername').val(user)
}
if (!$('#inpPass').val() || $('#inpPass').val() == '') {
    $('#inpPass').val(pass)
}