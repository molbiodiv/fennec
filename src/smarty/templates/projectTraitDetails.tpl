{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
{#call_webservice path="details/Traits" data=["trait_type_id"=>$trait_type_id, "dbversion"=>$DbVersion] assign='data'#}
<h2 class="page-header">{#$data['name']#}</h2>
<div class='row'>
    {#if $data['trait_format'] == 'categorical_free' #}
        <div class='col-xs-12'>
            <div id='pieChart'></div>
            <script src="{#$WebRoot#}/bower_components/plotly.js/dist/plotly.min.js"></script>
            <script src='{#$WebRoot#}/js/drawCharts.js'></script>
            <script>drawPieChart({#json_encode($data['values'])#});</script>
        </div>
    {#else #}
        <div class='col-xs-12'>
            <h1>Unknown trait type</h1>
        </div>
    {#/if#}
</div>
{#/block#}