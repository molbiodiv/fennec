{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
{#call_webservice path="details/Traits" data=["trait_type_id"=>$trait_type_id, "dbversion"=>$DbVersion] assign='data'#}
<h1 class="page-header">{#$data['name']#}</h1>
<h4 class="page-header">Definition</h4>
<div class="row">
    <div class='col-xs-8'>
        <a class='trait-details-link' href='{#$data['ontology_url']#}' target='_blank'>Go to definition</a>
    </div>
    <div class="col-xs-4">
        <div class="panel panel-trait-details">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-paw fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{#$data['number_of_organisms']#}</div>
                        <div>Organisms</div>
                    </div>
                </div>
            </div>
            <a href="{#$WebRoot#}/{#$DbVersion#}/organism/details/byTrait/{#$data['trait_type_id']#}">
                <div class="panel-footer info-trait-details">
                    <span class="pull-left">View all organisms with this trait</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
</div>
<h4 class="page-header">Data</h4>
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