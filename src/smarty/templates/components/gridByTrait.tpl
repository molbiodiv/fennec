{#call_webservice path="details/OrganismsWithTrait" data=["type_cvterm_id"=>$type_cvterm_id, "limit"=>$limit, "dbversion"=>$DbVersion] assign='data'#}
{#call_webservice path="details/Traits" data=["type_cvterm_id"=>$type_cvterm_id, "dbversion"=>$DbVersion] assign='trait'#}
<div class="row">
    <div class="col-lg-12">
        <h3 class='page-header'>All organisms which have trait information to <font style='font-style: italic'>{#$trait['name']#}</font></h3>
    </div>
</div>
{#foreach $data as $organism#}
<div class="col-lg-3">
    <div class="panel grid-organism" organism_id='{#$organism.organism_id#}'>
        <div class="panel-heading" style='height: 60px;'>
            <div class="row">
                <div class="col-xs-3">
                    <i class="fa fa-paw fa-2x"></i>
                </div>
                <div class="col-xs-9 text-right">
                    <div style="font-style: italic">
                        {#$organism.scientific_name#}
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer grid-info-organism" style='height: 80px;'>
            <div class="row">
                {#if $organism.common_name != null #}
                    <div class="col-xs-10 text-left">
                        common name: {#$organism.common_name#}
                    </div>
                {#/if#}
                <div class="col-xs-10 text-left">
                    rank: {#$organism.rank#}
                </div>
                <a class="grid-details-organism">
                    <div class="col-xs-2 text-right">
                        <a href="{#$WebRoot#}/{#$DbVersion#}/organism/details/byId/{#$organism.organism_id#}" class='fancybox' data-fancybox-type='ajax'><span class="pull-right"><i class="fa fa-arrow-circle-right fa-2x {#$type#}-link"></i></span></a>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
{#/foreach#}