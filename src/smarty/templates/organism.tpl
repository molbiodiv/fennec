{#extends file='layout.tpl'#}
{#block name='body'#}
    <div id="wrapper">
        
        {#include file='navigation.tpl'#}

        <div id="page-wrapper">
            <!-- /.row -->
            {#include file='title.tpl'#}
            
            <!-- /.row -->
            {#include file='panelRow.tpl'#}
            
            <!-- /.row -->
            {#include file='chart.tpl'#}
        <!-- /#page-wrapper -->
        </div>

    </div>
    <!-- /#wrapper -->
{#/block#}
