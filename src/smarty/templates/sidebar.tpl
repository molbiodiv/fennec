<!-- Template of the sidebar for navigation -->
 <div class="navbar-default sidebar" role="navigation">
    <div class="sidebar-nav navbar-collapse">
        <ul class="nav" id="side-menu">
             <li class="sidebar-search">
                <div class="input-group custom-search-form">
                    <input type="text" class="form-control" placeholder="Search...">
                    <span class="input-group-btn">
                    <button class="btn btn-default" type="button">
                        <i class="fa fa-search"></i>
                    </button>
                </span>
                </div>
            </li>
            <li>
                <a class="sidebar-{#$sidebar_type#}" href="index.html"><i class="fa fa-home fa-fw sidebar-{#$sidebar_type#}"></i> Home</a>
            </li>
            <li>
                <a href="index.html" class="sidebar-{#$sidebar_type#}"><i class="fa fa-book fa-fw sidebar-{#$sidebar_type#}"></i> Projects</a>
            </li>
            <li>
                <a href="index.html" class="sidebar-{#$sidebar_type#}"><i class="fa fa-tasks fa-fw sidebar-{#$sidebar_type#}"></i> Communities</a>
            </li>
            <li>
                <a href="index.html" class="sidebar-{#$sidebar_type#}"><i class="fa fa-paw fa-fw"></i> Organisms<span class="fa arrow sidebar-{#$sidebar_type#}"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="flot.html" class="sidebar-{#$sidebar_type#}">My Organisms</a>
                    </li>
                    <li>
                        <a href="morris.html" class="sidebar-{#$sidebar_type#}">Browse</a>
                    </li>
                    <li>
                        <a href="morris.html" class="sidebar-{#$sidebar_type#}">Search</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="index.html" class="sidebar-{#$sidebar_type#}"><i class="fa fa-globe fa-fw sidebar-{#$sidebar_type#}"></i> Traits<span class="fa arrow"></span></a>
                <ul class="nav nav-second-level">
                    <li>
                        <a href="flot.html" class="sidebar-{#$sidebar_type#}">Search</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!-- /.sidebar-collapse -->
</div>
<!-- /.navbar-static-side -->