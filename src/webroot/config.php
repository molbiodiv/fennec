<?php
    if (strpos(get_include_path(), '${share_path}')===FALSE){
        set_include_path(get_include_path().PATH_SEPARATOR.'${share_path}');
    }
    
    require_once '${share_path}/vendor/autoload.php';
    require_once '${config_dir}/config.php';
    
    define('SHARE_DIR', '${share_path}');
    define('VAR_DIR', '${var_path}');
?>
