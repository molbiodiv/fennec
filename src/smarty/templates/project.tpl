{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <form action="/upload.php" method="post" enctype="multipart/form-data">
    Select biom file to upload:
    <input type="file" name="fileToUpload" id="fileToUpload">
    <input type="submit" value="Upload biom file" name="submit">
    </form>
    {#include file='components/otuTable.tpl'#}
    {#include file='components/metadataTable.tpl'#}
{#/block#}