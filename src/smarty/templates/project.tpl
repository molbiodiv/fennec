{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <form action="{#$WebRoot#}/ajax/upload/Project?dbversion={#$DbVersion#}" method="post" enctype="multipart/form-data">
        <input id="project-fileupload" type="file" name="files[]" multiple>
        <input type="submit" value="Upload Project" name="submit">
    </form>
    <script src="{#$WebRoot#}/js/uploadProject.js" type="text/javascript"></script>
    {#include file='components/otuTable.tpl'#}
    {#include file='components/metadataTable.tpl'#}
{#/block#}