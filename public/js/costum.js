$('.back-btn').on('click', function () {
    window.history.back();
})


$(document).ready(function(){

    $('.nav-item').each(function(){
        var hreflink = $(this).children().attr('href')
        // console.log(hreflink);

        if(hreflink == localStorage.getItem('li_id')){
            $(this).children().addClass('active')
        }
        
    })
})

$('.logout-link').click(()=>{
    swal({
        title: "",
        text: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#323e47",
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                console.log('Logout');
                localStorage.removeItem('last_pass')
                setTimeout(function(){
                    window.location.href='/log-out'
                },1000)
            }
        });
        return false;
})


let userName = localStorage.getItem('last_user')
$('#name-user').html(userName)