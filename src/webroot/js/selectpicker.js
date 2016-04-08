$( document ).ready(function(){
    $('.selectpicker').selectpicker();
    $('#release').selectpicker('val', DbVersion);
    $('#release').on('changed.bs.select', function (e) {
        var resultPage =  WebRoot + "/" + $('#release').val();
        var path = window.location.pathname;
        path = path.replace(WebRoot, "");
        path = path.replace(DbVersion+"/", "");
        resultPage += path;
        window.location.href = resultPage;
    });
});
