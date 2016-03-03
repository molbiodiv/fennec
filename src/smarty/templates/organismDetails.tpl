{#call_webservice path="listing/Details" data=["id"=>$organismId] assign='data'#}
{#call_webservice path="listing/Taxonomy" data=["id"=>$organismId] assign='taxonomy'#}
<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #076565; margin-bottom: 10px; border-radius: 5px; ">
    <h1 class="page-header" style="color: #fff;">{#$data['scientific_name']#}</h1>
</div>
<div class="col-md-12">
    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a class="organism-link" href="#overview" role="tab" data-toggle="tab">Overview</a></li>
            <li role="presentation"><a class="organism-link" href="#detail" aria-controls="detail" role="tab" data-toggle="tab">Detail</a></li>
            <li role="presentation"><a class="organism-link" href="#traits" aria-controls="traits" role="tab" data-toggle="tab">Traits</a></li>
            <li role="presentation"><a class="organism-link" href="#taxonomy" aria-controls="taxonomy" role="tab" data-toggle="tab">Taxonomy</a></li>
            <li role="presentation"><a class="organism-link" href="#community" aria-controls="community" role="tab" data-toggle="tab">Community</a></li>
            <li role="presentation"><a class="organism-link" href="#literature" aria-controls="literature" role="tab" data-toggle="tab">Literature</a></li>
        </ul>

        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="overview">
                <div class="col-md-4" style="margin-top: 10px;">
                    <a href="{#$WebRoot#}/css/img/test2.jpg" class="thumbnail fancybox" data-fancybox-type='iframe'>
                        <img src="{#$WebRoot#}/css/img/test2.jpg">
                    </a>
                    <a href="{#$WebRoot#}/css/img/test1.jpg" class="thumbnail">
                        <img src="{#$WebRoot#}/css/img/test1.jpg">
                    </a>
                    <a href="{#$WebRoot#}/css/img/test2.jpg" class="thumbnail">
                        <img src="{#$WebRoot#}/css/img/test2.jpg">
                    </a>
                </div>
                <div class="col-md-6">
                    <h4 class="page-header">Characteristics</h4>
                        <div class="col-md-6 text-left" style="font-weight: bold">
                            metabolic rate
                        </div> 
                        <div class="col-md-6 text-right">
                            467.97 mL/hr O2
                        </div>
                        <div class="col-md-6 text-left" style="font-weight: bold; margin-top: 5px;">
                            body length (VT)
                        </div> 
                        <div class="col-md-6 text-right" style="margin-top: 5px;">
                            111.7 mm newborn animal<br>
                            374.23 mm adult
                        </div>
                        <div class="col-md-6 text-left" style="font-weight: bold; margin-top: 5px;">
                            habitat
                        </div> 
                        <div class="col-md-6 text-right" style="margin-top: 5px;">
                            arid<br>
                            coast<br>
                            desert<br>
                            more
                        </div>
                    <h4 class="page-header">Lineage</h4>
                        {#foreach $taxonomy['lineage'] as $organism#}
                            {#$organism#}
                        {#/foreach#}
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="detail"></div>
            <div role="tabpanel" class="tab-pane" id="traits"></div>
            <div role="tabpanel" class="tab-pane" id="taxonomy"></div>
            <div role="tabpanel" class="tab-pane" id="community"></div>
            <div role="tabpanel" class="tab-pane" id="literature"></div>
        </div>
    </div>
</div>