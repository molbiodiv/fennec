<h3 class="page-header">
    Not sure where to start? Explore our database with the following interactive search tool:
</h3>
{#if $searchLevel == 'habitat' #}
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-trait" style="width: 1040px;">
            <div class="panel-heading">
                <div class="row">
                    <h4 style="margin-left: 10px">habitat</h4>
                    <p style="margin-left: 10px;">The natural environment in which an organism lives, or the physical environment that surrounds 
                        (influences and is utilized by) a species population.</p>
                </div>
            </div>
            <div class="panel-footer info-trait">
                <svg width='1000' height='750' style='background-image: url("{#$WebRoot#}/css/img/traitInteractiveBrowse_{#$searchLevel#}.png")' id='interactiveBrowse_{#$searchLevel#}'/>
            </div>
        </div>
    </div>
</div>
{#elseif $searchLevel == 'woodland' #}
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-trait" style="width: 1040px;">
            <div class="panel-heading">
                <div class="row">
                    <h4 style="margin-left: 10px">woodland</h4>
                </div>
            </div>
            <div class="panel-footer info-trait">
                <svg width='1000' height='750' style='background-image: url("{#$WebRoot#}/css/img/traitInteractiveBrowse_{#$searchLevel#}.png")' id='interactiveBrowse_{#$searchLevel#}'/>
            </div>
        </div>
    </div>
</div>
{#elseif $searchLevel == 'geographicalZone' #}
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-trait" style="width: 1040px;">
            <div class="panel-heading">
                <div class="row">
                    <h4 style="margin-left: 10px">geographical zone</h4>
                    <p style="margin-left: 10px;">Broad geographical regions separated by latitude. Polar, subpolar, temperate, subtropical, tropical, boreal, arctoboreal, cosmopolitan, etc. </p>
                </div>
            </div>
            <div class="panel-footer info-trait">
                <svg width='1000' height='524' style='background-image: url("{#$WebRoot#}/css/img/traitInteractiveBrowse_{#$searchLevel#}.png")' id='interactiveBrowse_{#$searchLevel#}'>
                <a xlink:href="https://freevectormaps.com/world-maps" target="_blank">
                    <text x="800" y="510">Map by FreeVectorMaps.com</text>
                </a>
                </svg>
            </div>
        </div>
    </div>
</div>
{#elseif $searchLevel == 'plant' #}
<div class="row">
    <div class="col-lg-12">
        <div class="panel panel-trait" style="width: 1040px;">
            <div class="panel-heading">
                <div class="row">
                    <h4 style="margin-left: 10px">plant</h4>
                    <p style="margin-left: 10px;">Broad geographical regions separated by latitude. Polar, subpolar, temperate, subtropical, tropical, boreal, arctoboreal, cosmopolitan, etc. </p>
                </div>
            </div>
            <div class="panel-footer info-trait">
                <svg width='1000' height='750' style='background-image: url("{#$WebRoot#}/css/img/traitInteractiveBrowse_{#$searchLevel#}.png")' id='interactiveBrowse_{#$searchLevel#}'/>
            </div>
        </div>
    </div>
</div>
{#/if#}