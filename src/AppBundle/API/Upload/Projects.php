<?php

namespace AppBundle\API\Upload;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Permissions;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;
use biomcs\BiomCS;

/**
 * Web Service.
 * Uploads Project biom files and save them in the database
 */
class Projects
{
    const ERROR_IN_REQUEST = "Error. There was an error in your request.";
    const ERROR_NOT_BIOM = "Error. Not a biom file.";
    const ERROR_DB_INSERT = "Error. Could not insert into database.";
    const ERROR_NOT_LOGGED_IN = "Error. You are not logged in.";

    private $manager;

    private $required_biom1_toplevel_keys;

    /**
     * Projects constructor.
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getUserEntityManager();
        $this->required_biom1_toplevel_keys = array(
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
    }


    /**
     * @inheritdoc
     * @returns array result of file upload
     */
    public function execute(FennecUser $user = null)
    {
        ini_set('memory_limit', '512M');
        $files = array();
        if ($user === null) {
            $files = array("error" => Projects::ERROR_NOT_LOGGED_IN);
        } else {
            for ($i=0; $i<sizeof($_FILES); $i++) {
                $valid = $this->validateAndConvertFile($_FILES[$i]['tmp_name']);
                if ($valid === true) {
                    $project = new Project();
                    $project->setProject(json_decode(file_get_contents($_FILES[$i]['tmp_name'])));
                    $project->setUser($user);
                    $project->setImportFilename($_FILES[$i]['name']);
                    $this->manager->persist($project);
                    $permission = new Permissions();
                    $permission->setUser($user);
                    $permission->setProject($project);
                    $permission->setPermission('owner');
                    $this->manager->persist($permission);
                }
                $file = array(
                    "name" => $_FILES[$i]['name'],
                    "size" => $_FILES[$i]['size'],
                    "error" => ($valid === true ? null : $valid)
                );
                $files[] = $file;
            }
        }
        $this->manager->flush();
        return array("files" => $files);
    }

    /**
     * Function that checks the uploaded file for validity and converts it to BIOM v1 (json) from HDF5 or tsv
     * @param String $filename the uploaded file to check
     * @returns String|boolean Either true if the file is valid or a String containing the error message
     */
    protected function validateAndConvertFile($filename)
    {
        if (!is_uploaded_file($filename)) {
            return Projects::ERROR_IN_REQUEST;
        }
        $contents = file_get_contents($filename);
        if ($contents === false) {
            return Projects::ERROR_NOT_BIOM;
        }
        $json = json_decode($contents);
        if (json_last_error() !== JSON_ERROR_NONE) {
            putenv("LC_ALL=C.UTF-8");
            putenv("LANG=C.UTF-8");
            $biomcs = new BiomCS();
            try {
                $json = $biomcs->convertToJSON($contents);
                file_put_contents($filename, $json);
                $json = json_decode($json);
            } catch (\Exception $e){
                return Projects::ERROR_NOT_BIOM;
            }
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
