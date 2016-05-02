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
        $contents = file_get_contents($_FILES['files']['tmp_name'][0]);
        $data = array("contents" => $contents);
        return $data;
    }
}
