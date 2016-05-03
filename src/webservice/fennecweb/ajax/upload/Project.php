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
            $valid = $this->validateFile($_FILES['files']['tmp_names'][$i]);
            $file = array(
                "name" => $_FILES['files']['names'][$i],
                "size" => $_FILES['files']['sizes'][$i],
                "error" => null
            );
            $files[] = $file;
        }
        return array("files" => $files);
    }

    /**
     * Function that checks the uploaded file for validity
     * @param String $filename the uploaded file to check
     * @returns Either TRUE if the file is valid or a String containing the error message
     */
    protected function validateFile($filename)
    {
        if (!is_uploaded_file($filename)) {
            return "Error. There was an error in your request.";
        }
    }
}
