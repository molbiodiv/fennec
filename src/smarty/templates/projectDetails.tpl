{#extends file='layoutWithBars.tpl'#}
{#call_webservice path="details/Projects" data=["ids"=>[$internal_project_id], "dbversion"=>$DbVersion] assign='data'#}
{#block name='content'#}
    {#if isset($data['error'])#}
    <h3>Error: {#$data['error']#}</h3>
    {#elseif count($data['projects'])<1#}
    <h3>Error: This project could not be found for the current user.</h3>
    {#else#}
    {#var_dump($data)#}
    {#/if#}
{#/block#}