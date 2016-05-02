<?php
/*
 * jQuery File Upload Plugin PHP Class
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

class BiomUploadHandler
{

    public function __construct()
    {
        var_dump($_POST);
        var_dump($_FILES);
        $this->initialize();
    }

    protected function initialize()
    {
        $contents = file_get_contents($_FILES['files']['tmp_name'][0]);
        var_dump($contents);
    }
}
