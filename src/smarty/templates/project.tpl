{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <h4> Upload projects in <a href="http://biom-format.org/documentation/format_versions/biom-1.0.html">biom format (version 1.0)</a></h4>
    <div id="project-upload-message-area"></div>
    <form>
        <input class="btn" id="project-fileupload" type="file" name="files[]" multiple>
    </form>
    <script src="{#$WebRoot#}/js/uploadProject.js" type="text/javascript"></script>
    {#include file='components/otuTable.tpl'#}
    {#include file='components/metadataTable.tpl'#}
{#/block#}