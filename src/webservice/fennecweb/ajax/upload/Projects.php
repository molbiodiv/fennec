<?php

namespace fennecweb\ajax\upload;

use \fennecweb\WebService as WebService;

/**
 * Web Service.
 * Uploads Project biom files and save them in the database
 */
class Projects extends \fennecweb\WebService
{
    const ERROR_IN_REQUEST = "Error. There was an error in your request.";
    const ERROR_NOT_BIOM = "Error. Not a biom file.";
    const ERROR_DB_INSERT = "Error. Could not insert into database.";

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

    private $query_insert_project_into_db = <<<EOF
INSERT INTO full_webuser_data (project, oauth_id, provider, import_filename) VALUES (:project, :user, :provider, :filename);
EOF;

    /**
     * @param $querydata[]
     * @returns result of file upload
     */
    public function execute($querydata)
    {
        ini_set('memory_limit', '512M');
        $db = $this->openDbConnection($querydata);
        $files = array();
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $files = array("error" => WebService::ERROR_NOT_LOGGED_IN);
        } else {
            for ($i=0; $i<sizeof($_FILES); $i++) {
                $valid = $this->validateFile($_FILES[$i]['tmp_name']);
                if ($valid === true) {
                    $stm_get_organisms = $db->prepare($this->query_insert_project_into_db);
                    $stm_get_organisms->bindValue('project', file_get_contents($_FILES[$i]['tmp_name']));
                    $stm_get_organisms->bindValue('user', $_SESSION['user']['id']);
                    $stm_get_organisms->bindValue('provider', $_SESSION['user']['provider']);
                    $stm_get_organisms->bindValue('filename', $_FILES[$i]['name']);
                    if (! $stm_get_organisms->execute()) {
                        $valid = Project::ERROR_DB_INSERT;
                    }
                }
                $file = array(
                    "name" => $_FILES[$i]['name'],
                    "size" => $_FILES[$i]['size'],
                    "error" => ($valid === true ? null : $valid)
                );
                $files[] = $file;
            }
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
            return Projects::ERROR_IN_REQUEST;
        }
        // Try to get file type with UNIX file command
        $filetype = exec('file '.escapeshellarg($filename));
        if(strpos($filetype, 'Hierarchical Data Format (version 5) data') !== FALSE){
            $result = array();
            $errorcode = 0;
            exec('biom convert -i '.escapeshellarg($filename).' -o '.escapeshellarg($filename).'.json --to-json', $result, $errorcode);
            if($errorcode === 0){
                rename($filename.'.json', $filename);
            }
            else{
                if(file_exists($filename.'json')){
                    unlink($filename.'.json');
                }
            }
        }
        $contents = file_get_contents($filename);
        if ($contents === false) {
            return Projects::ERROR_NOT_BIOM;
        }
        $json = json_decode($contents);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return Projects::ERROR_NOT_BIOM;
        }
        if (!is_object($json)) {
            return Projects::ERROR_NOT_BIOM;
        }
        foreach ($this->required_biom1_toplevel_keys as $key) {
            if (!array_key_exists($key, $json)) {
                return Projects::ERROR_NOT_BIOM;
            }
        }
        return true;
    }
}
