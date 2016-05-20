{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <h3> Upload projects in <a href="http://biom-format.org/documentation/format_versions/biom-1.0.html">biom format (version 1.0)</a></h3>
    <div id="project-upload-message-area"></div>
    <form>
        <input class="btn" id="project-fileupload" type="file" name="files[]" multiple>
    </form>
    <script src="{#$WebRoot#}/js/uploadProject.js" type="text/javascript"></script>
    <i class="fa fa-refresh fa-spin" style="font-size:24px; display:none" id="project-upload-busy-indicator"></i>

    <h3> My projects </h3>
    <table id="project-table" class="table project-table project-table-striped table-bordered" width="100%" cellspacing="0">
        <thead>
            <tr><th>ID</th><th>Import Date</th><th># OTUs</th><th># Samples</th></tr>
        </thead>
    </table>
    <script type="text/javascript">
        var table = $('#project-table').DataTable( {
            ajax: {
                url: '{#$ServicePath#}/listing/projects?dbversion={#$DbVersion#}',
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                { data: 'import_date' },
                { data: 'rows' },
                { data: 'columns' }
            ]
        } );
    </script>
{#/block#}