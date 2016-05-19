<!-- This is the title for the site e.g. Welcome, Projects, Traits, etc. -->
{#if isset($title) #}
<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <h1 class="page-header">{#$title#} {#if isset($user)#}{#$user#}{#else#}{#/if#}</h1>
    </div>
</div>
{#/if#}
