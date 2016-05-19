{#call_webservice path="listing/Projects" data=["dbversion"=>$DbVersion] assign='data'#}
{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <input id="fileupload" type="file" name="files[]" data-url="{#$WebRoot#}/ajax/upload/Project?dbversion={#$DbVersion#}" multiple>
        <script src="/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="/bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
        <script src="/bower_components/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
        <script src="/bower_components/blueimp-file-upload/js/jquery.fileupload.js"></script>
        <script>
$(function () {
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        }
    });
});
        </script>
        <div id="progress">
            <div class="bar" style="width: 0%;height: 18px; background: green;"></div>
        </div>
        
        <div class="col-lg-12">
            {#if isset($data.error)#}
                {#$data.error#}
            {#else#}
                {#foreach $data as $project#}
                    id: {#$project.id#} <br>
                    import_date: {#$project.import_date#} <br>
                    columns: {#$project.columns#} <br>
                    rows: {#$project.rows#} <br>
                {#/foreach#}
            {#/if#}
        </div>
{#/block#}