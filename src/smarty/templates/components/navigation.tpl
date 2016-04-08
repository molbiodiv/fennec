<!-- Navigation -->
<script src="{#$WebRoot#}/js/selectpicker.js"></script>
<nav class="navbar navbar-static-top navbar-{#$type#}" role="navigation">
    <div class="navbar-header">
        <img src="{#$WebRoot#}/css/img/animal-{#$type#}.png" height="50px"/>
        <font class="navbar-brand navbar-{#$type#}">Fennec {#$fennec_version#}</font>
    </div
    <!-- /.navbar-header -->

    <ul class="nav navbar-top-links navbar-right">
        <font style="margin-right: 5px; font-size: 16px;">release: </font> 
        <select class="selectpicker" id="release">
            {#foreach $allDbVersions as $thisVersion#}
                <option data-icon="glyphicon-tag" value="{#$thisVersion#}" > {#$thisVersion#} </option>
            {#/foreach#}
        </select>
        <font style="margin-left: 20px; margin-right: 5px; font-size: 16px;">organism: </font>
        <select class="selectpicker">
            <option data-icon="glyphicon-star">all organisms</option>
            <optgroup>
                <option data-icon="glyphicon-tree-deciduous">viridiplantae</option>
            </optgroup>
        </select>
        
        <li class="dropdown">
            <a class="dropdown-toggle navbar-{#$type#} navbar-icon-{#$type#}" data-toggle="dropdown" href="#" style="background-color: transparent;">
                <i class="fa fa-question-circle"></i> help <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#"><i class="fa fa-book"></i> Manual</a>
                </li>
            </ul>
            <!-- /.dropdown-help -->
        </li>
        
        <li class="dropdown">
            <a class="dropdown-toggle navbar-{#$type#} navbar-icon-{#$type#}" data-toggle="dropdown" href="#" style="background-color: transparent;">
                <i class="fa fa-user fa-fw"></i>  login <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-user">
                <li><a href="#"><i class="fa fa-user fa-fw"></i> My Profile</a>
                </li>
                <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                </li>
                <li class="divider"></li>
                <li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                </li>
            </ul>
            <!-- /.dropdown-user -->
        </li>
        <!-- /.dropdown -->
    </ul>
    <!-- /.navbar-top-links -->

<!-- Sidebar for navigation -->
 <div class="navbar-default sidebar" role="navigation">
    <div class="sidebar-nav navbar-collapse">
        <ul class="nav" id="side-menu">
            <li>
                <a class="sidebar-{#$type#} {#$type#}-link" href="{#$WebRoot#}/{#$DbVersion#}/startpage"><i class="fa fa-home fa-fw sidebar-{#$type#}"></i> Home</a>
            </li>
            <li>
                <a href="{#$WebRoot#}/{#$DbVersion#}/project" class="sidebar-{#$type#} {#$type#}-link"><i class="fa fa-book fa-fw sidebar-{#$type#}"></i> Projects</a>
            </li>
            <li>
                <a href="{#$WebRoot#}/{#$DbVersion#}/community" class="sidebar-{#$type#} {#$type#}-link"><i class="fa fa-tasks fa-fw sidebar-{#$type#}"></i> Communities</a>
            </li>
            <li>
                <a class="sidebar-{#$type#} {#$type#}-link"><i class="fa fa-paw fa-fw"></i> Organisms<span class="fa arrow sidebar-{#$type#}"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="{#$WebRoot#}/{#$DbVersion#}/organism" class="sidebar-{#$type#} {#$type#}-link">Search</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{#$WebRoot#}/{#$DbVersion#}/trait" class="sidebar-{#$type#} {#$type#}-link"><i class="fa fa-globe fa-fw sidebar-{#$type#}"></i> Traits<span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="{#$WebRoot#}/{#$DbVersion#}/trait" class="sidebar-{#$type#} {#$type#}-link">Search</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!-- /.sidebar-collapse -->
</div>
<!-- /.navbar-static-side -->
</nav>