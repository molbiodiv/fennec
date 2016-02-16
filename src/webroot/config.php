<?php
    if (strpos(get_include_path(), '${share_path}')===FALSE){
        set_include_path(get_include_path().PATH_SEPARATOR.'${share_path}');
    }
    if (strpos(get_include_path(), '${share_path}/pear/log')===FALSE){
        set_include_path(get_include_path().PATH_SEPARATOR.'${share_path}/pear/log');
    }
    require_once '${config_dir}/config.php';
    
    define('SHARE_DIR', '${share_path}');
    define('VAR_DIR', '${var_path}');
?>
