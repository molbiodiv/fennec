<!-- Contains the css and js libraries of layout.tpl and add the navigation.tpl (includes sidebar.tpl itself) and the title.tpl -->
{#extends file='layout.tpl'#}
{#block name='body'#}
    <div id="wrapper">
        
        {#include file='navigation.tpl'#}

        <div id="page-wrapper">
            <!-- /.row -->
            {#include file='title.tpl'#}
            
            {#block name='content'#}{#/block#}
        <!-- /#page-wrapper -->
        </div>
    </div>
    <!-- /#wrapper -->
{#/block#}