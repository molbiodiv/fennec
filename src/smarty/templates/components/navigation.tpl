<!-- Navigation -->
<nav class="navbar navbar-static-top navbar-{#$type#}" role="navigation">
    <div class="navbar-header">
        <img src="css/img/animal-{#$type#}.png" height="50px"/>
        <a class="navbar-brand navbar-{#$type#}" href="/">Fennec {#$fennec_version#}</a>
    </div>
    <!-- /.navbar-header -->

    <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
            <a class="dropdown-toggle navbar-{#$type#} navbar-icon-{#$type#}" data-toggle="dropdown" href="#">
                <i class="fa fa-question-circle"></i> <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#"><i class="fa fa-book"></i> Manual</a>
                </li>
            </ul>
            <!-- /.dropdown-help -->
        </li>
        
        <li class="dropdown">
            <a class="dropdown-toggle navbar-{#$type#} navbar-icon-{#$type#}" data-toggle="dropdown" href="#">
                <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>
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
                <a class="sidebar-{#$type#}" href="{#$WebRoot#}/"><i class="fa fa-home fa-fw sidebar-{#$type#}"></i> Home</a>
            </li>
            <li>
                <a href="{#$WebRoot#}/project" class="sidebar-{#$type#}"><i class="fa fa-book fa-fw sidebar-{#$type#}"></i> Projects</a>
            </li>
            <li>
                <a href="{#$WebRoot#}/community" class="sidebar-{#$type#}"><i class="fa fa-tasks fa-fw sidebar-{#$type#}"></i> Communities</a>
            </li>
            <li>
                <a class="sidebar-{#$type#}"><i class="fa fa-paw fa-fw"></i> Organisms<span class="fa arrow sidebar-{#$type#}"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="flot.html" class="sidebar-{#$type#}">My Organisms</a>
                    </li>
                    <li>
                        <a href="morris.html" class="sidebar-{#$type#}">Browse</a>
                    </li>
                    <li>
                        <a href="{#$WebRoot#}/organism" class="sidebar-{#$type#}">Search</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{#$WebRoot#}/trait" class="sidebar-{#$type#}"><i class="fa fa-globe fa-fw sidebar-{#$type#}"></i> Traits<span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="{#$WebRoot#}/trait" class="sidebar-{#$type#}">Search</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!-- /.sidebar-collapse -->
</div>
<!-- /.navbar-static-side -->
</nav>