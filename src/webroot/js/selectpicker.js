$( document ).ready(function(){
    $('.selectpicker').selectpicker();
    $('#dbVersionPicker').selectpicker('val', DbVersion);
    $('#dbVersionPicker').on('changed.bs.select', function (e) {
        var resultPage =  WebRoot + "/" + $('#dbVersionPicker').val();
        var path = window.location.pathname;
        path = path.replace(WebRoot, "");
        path = path.replace(DbVersion+"/", "");
        resultPage += path;
        window.location.href = resultPage;
    });
});
