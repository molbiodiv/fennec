{#extends file='layoutWithBars.tpl'#}
{#call_webservice path="details/Projects" data=["ids"=>[$id], "dbversion"=>$DbVersion] assign='data'#}
{#block name='content'#}
    
{#/block#}