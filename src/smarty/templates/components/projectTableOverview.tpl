<h3>
    Upload projects in <a href="http://biom-format.org/documentation/format_versions/biom-1.0.html">biom format</a>
    <i data-toggle="tooltip" title="Version 1.0 is stored as is, version 2.x is converted to 1.0 on the web server" class="fa fa-question-circle"></i>
</h3>
<form>
    <input class="btn" id="project-fileupload" type="file" name="files[]" multiple>
</form>
<script src="{#$WebRoot#}/js/uploadProject.js"></script>
<i class="fa fa-refresh fa-spin" style="font-size:24px; display:none" id="project-upload-busy-indicator"></i>

<h3> My projects </h3>
<table id="project-table" class="table project-table project-table-striped table-bordered" width="100%" cellspacing="0">
    <thead>
        <tr><th>ID</th><th>Import Filename</th><th>Import Date</th><th># OTUs</th><th># Samples</th><th>Actions</th></tr>
    </thead>
</table>
<script src="{#$WebRoot#}/js/projectTable.js"></script>