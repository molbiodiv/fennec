{#call_webservice path="listing/Traits" data=["search"=>"", limit=>6, "dbversion"=>$dbversion] assign='data'#}
{#foreach $data as $trait#}
    {#if $trait@iteration > $max#}{#break#}{#/if#} 
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <div class="panel panel-trait">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <img src="{#$WebRoot#}/css/img/{#$trait['name']#}.png" height="100px" style="float: left">
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{#$trait['frequency']#}</div>
                        <div>{#$trait['name']#}</div>
                    </div>
                </div>
            </div>
             <a href="{#$WebRoot#}/trait/details/byId/{#$trait['type_cvterm_id']#}" class='fancybox' data-fancybox-type='ajax'>
                <div class="panel-footer info-trait">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
{#/foreach#}