{#extends file='layoutWithBars.tpl'#}
{#block name='content'#}
{#if !isset($user)#}
    <h3> Please log in to see your projects or add new ones. </h3>
{#else#}
    {#include file='components/projectTableOverview.tpl'#}
{#/if#}
{#/block#}