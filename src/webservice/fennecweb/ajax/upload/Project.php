<?php

namespace fennecweb\ajax\upload;

use \PDO as PDO;

/**
 * Web Service.
 * Uploads Project biom files and save them in the database
 */
class Project extends \fennecweb\WebService
{

    /**
     * @param $querydata[]
     * @returns result of file upload
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $files = array();
        for ($i=0; $i<sizeof($_FILES['files']['tmp_names']); $i++) {
            $file = array(
                "name" => $_FILES['files']['names'][$i],
                "size" => $_FILES['files']['sizes'][$i],
                "error" => null
            );
            $files[] = $file;
        }
        return array("files" => $files);
    }
}
