{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
    <input type="submit" value="Upload Project" name="submit">
    <script src="{#$WebRoot#}/js/uploadProject.js" type="text/javascript"></script>
    {#include file='components/otuTable.tpl'#}
    {#include file='components/metadataTable.tpl'#}
{#/block#}