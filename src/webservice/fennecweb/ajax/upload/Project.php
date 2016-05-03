<?php

namespace fennecweb\ajax\upload;

use \PDO as PDO;

/**
 * Web Service.
 * Uploads Project biom files and save them in the database
 */
class Project extends \fennecweb\WebService
{
    const ERROR_IN_REQUEST = "Error. There was an error in your request.";
    const ERROR_NOT_TEXT = "Error. Not a text file.";
    const ERROR_NOT_JSON = "Error. Not a json file.";
    const ERROR_NOT_BIOM = "Error. Not a biom file.";

    public $required_biom1_toplevel_keys = array(
        'id',
        'format',
        'format_url',
        'type',
        'generated_by',
        'date',
        'rows',
        'columns',
        'matrix_type',
        'matrix_element_type',
        'shape',
        'data'
    );

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
                "error" => ($valid === true ? null : $valid)
            );
            $files[] = $file;
        }
        return array("files" => $files);
    }

    /**
     * Function that checks the uploaded file for validity
     * @param String $filename the uploaded file to check
     * @returns Either true if the file is valid or a String containing the error message
     */
    protected function validateFile($filename)
    {
        if (!is_uploaded_file($filename)) {
            return Project::ERROR_IN_REQUEST;
        }
        $contents = file_get_contents($filename);
        if ($contents === false) {
            return Project::ERROR_NOT_TEXT;
        }
        $json = json_decode($contents);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return Project::ERROR_NOT_JSON;
        }
        if (!is_object($json)) {
            return Project::ERROR_NOT_BIOM;
        }
        foreach ($this->required_biom1_toplevel_keys as $key) {
            if (!array_key_exists($key, $json)) {
                return Project::ERROR_NOT_BIOM;
            }
        }
        return true;
    }
}
