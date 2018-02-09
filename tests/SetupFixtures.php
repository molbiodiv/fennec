<?php

namespace Tests;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Permissions;
use AppBundle\Entity\User\WebuserData;
use Doctrine\ORM\EntityManager;

class SetupFixtures
{
    /**
     * @var EntityManager
     */
    private $em;

    public function __construct($em)
    {
        $this->em = $em;
    }

    public function insertUserData()
    {
        $this->insert_full_webuser_data($this->defaultBiom, 'listingProjectsTestUser', 'listingProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'listingProjectsTestFile.biom');
        $this->insert_full_webuser_data($this->defaultBiom, 'ProjectRemoveTestUser', 'ProjectRemoveTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'removeProjectsTestFile.biom');
        $this->insert_full_webuser_data($this->defaultBiom, 'detailsProjectsTestUser', 'detailsProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'detailsProjectsTestFile.biom');
        $smallBiom = array_merge($this->defaultBiom, array(
            'shape' => [5,2],
            "rows" => [
                ["id" => "OTU_1", "metadata" => []],
                ["id" => "OTU_2", "metadata" => []],
                ["id" => "OTU_3", "metadata" => []],
                ["id" => "OTU_4", "metadata" => []],
                ["id" => "OTU_5", "metadata" => []]
            ],
            "columns" => [
                ["id" => "Sample_1", "metadata" => []],
                ["id" => "Sample_2", "metadata" => []]
            ]
            )
        );
        $this->insert_full_webuser_data($smallBiom, 'detailsProjectsTestUser', 'detailsProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'detailsProjectsTestFile.biom');
        $this->insert_full_webuser_data($smallBiom, 'listingOverviewTestUser', 'listingOverviewTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'listingOverviewTestFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": null}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 3}}"]],
            ["id" => "OTU_3", "metadata" => []],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 3}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 42}}"]]
        );
        $columns = array(
            ["id" => "Sample_1", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1340}}"]],
            ["id" => "Sample_2", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1630}}"]]
        );
        $this->insert_full_webuser_data(array_merge($smallBiom, array('rows'=>$rows, 'columns' => $columns)),'detailsOrganismsOfProjectTestUser', 'detailsOrganismsOfProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'detailsOrganismsOfProjectFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1340}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1630}}"]],
            ["id" => "OTU_3", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 24718}}"]],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 73023}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 23057}}"]]
        );
        $columns = array(
            ["id" => "Sample_1", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1340}}"]],
            ["id" => "Sample_2", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 1630}}"]]
        );
        $this->insert_full_webuser_data(array_merge($smallBiom, array('rows'=>$rows, 'columns'=>$columns)),'detailsTraitOfProjectTestUser', 'detailsTraitOfProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'),'detailsTraitOfProjectFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 134097}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 163840}}"]],
            ["id" => "OTU_3", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 24718}}"]],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 73023}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test\": {\"fennec_id\": 23057}}"]]
        );
        $this->insert_full_webuser_data(array_merge($smallBiom, array('rows'=>$rows)),'UpdateProjectTestUser', 'UpdateProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'updateProjectFile.biom');
    }

    private function insert_full_webuser_data($project, $oauth_id, $provider, $import_date, $import_filename)
    {
        $user_repo = $this->em->getRepository('AppBundle:FennecUser');
        $webuser = $user_repo->findOneBy(array('github_access_token' => $oauth_id));
        if ($webuser === null) {
            $webuser = new FennecUser();
            $webuser->setGithubAccessToken($oauth_id);
            $webuser->setUsername($oauth_id);
            $webuser->setPassword('frikadelle');
            $webuser->setEmail($oauth_id);
            $this->em->persist($webuser);
        }
        $webuserData = new WebuserData();
        $webuserData->setProject($project);
        $webuserData->setWebuser($webuser);
        $webuserData->setImportDate($import_date);
        $webuserData->setImportFilename($import_filename);
        $permission = new Permissions();
        $permission->setPermission('owner');
        $permission->setWebuser($webuser);
        $permission->setWebuserData($webuserData);
        $this->em->persist($permission);
        $this->em->persist($webuserData);
        $this->em->flush();
    }

    private $defaultBiom = array(
        "id" => "table_1",
        "format" => "Biological Observation Matrix 2.1.0",
        "format_url" => "http://biom-format.org",
        "matrix_type" => "sparse",
        "generated_by" => "BIOM-Format 2.1",
        "date" => "2016-05-03T08:13:41.848780",
        "type" => "OTU table",
        "matrix_element_type" => "float",
        "shape" => [10, 5],
        "data" => [[0,0,120.0],[3,1,12.0],[5,2,20.0],[7,3,12.7],[8,4,16.0]],
        "rows" => [
            ["id" => "OTU_1", "metadata" => []],
            ["id" => "OTU_2", "metadata" => []],
            ["id" => "OTU_3", "metadata" => []],
            ["id" => "OTU_4", "metadata" => []],
            ["id" => "OTU_5", "metadata" => []],
            ["id" => "OTU_6", "metadata" => []],
            ["id" => "OTU_7", "metadata" => []],
            ["id" => "OTU_8", "metadata" => []],
            ["id" => "OTU_9", "metadata" => []],
            ["id" => "OTU_10", "metadata" => []]
        ],
        "columns" => [
            ["id" => "Sample_1", "metadata" => []],
            ["id" => "Sample_2", "metadata" => []],
            ["id" => "Sample_3", "metadata" => []],
            ["id" => "Sample_4", "metadata" => []],
            ["id" => "Sample_5", "metadata" => []]
        ]
    );
}