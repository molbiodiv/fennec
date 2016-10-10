<!-- Contains the css and js libraries of layout.tpl and add the navigation.tpl (includes sidebar.tpl itself) and the title.tpl -->
{#extends file='layout.tpl'#}
{#block name='body'#}
    <div id="wrapper">
        
        {#include file='components/navigation.tpl'#}
        <div id="page-wrapper">
            <!-- /.row -->
            {#include file='components/title.tpl'#}
            <div id="global-message-area"></div>
            <script src="{#$WebRoot#}/js/message.js"></script>
            {#block name='content'#}{#/block#}
        <!-- /#page-wrapper -->
        </div>
    </div>
    <!-- /#wrapper -->
{#/block#}