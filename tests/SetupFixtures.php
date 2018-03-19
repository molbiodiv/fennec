<?php

namespace Tests;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Permissions;
use AppBundle\Entity\User\Project;
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
        $this->insert_full_user_data($this->defaultBiom, 'listingProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'listingProjectsTestFile.biom');
        $this->insert_full_user_data($this->defaultBiom, 'ProjectRemoveTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'removeProjectsTestFile.biom');
        $this->insert_full_user_data($this->defaultBiom, 'detailsProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'detailsProjectsTestFile.biom');
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
        $this->insert_full_user_data($smallBiom, 'detailsProjectsTestUser', new \DateTime('2016-05-17T10:00:52+0000'), 'detailsProjectsTestFile.biom');
        $this->insert_full_user_data($smallBiom, 'listingOverviewTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'listingOverviewTestFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": null}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 3}}"]],
            ["id" => "OTU_3", "metadata" => []],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 3}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 42}}"]]
        );
        $columns = array(
            ["id" => "Sample_1", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1340}}"]],
            ["id" => "Sample_2", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1630}}"]]
        );
        $this->insert_full_user_data(array_merge($smallBiom, array('rows'=>$rows, 'columns' => $columns)),'detailsOrganismsOfProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'detailsOrganismsOfProjectFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1340}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1630}}"]],
            ["id" => "OTU_3", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 24718}}"]],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 73023}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 23057}}"]]
        );
        $columns = array(
            ["id" => "Sample_1", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1340}}"]],
            ["id" => "Sample_2", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 1630}}"]]
        );
        $this->insert_full_user_data(array_merge($smallBiom, array('rows'=>$rows, 'columns'=>$columns)),'detailsTraitOfProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'),'detailsTraitOfProjectFile.biom');
        $rows =  array(
            ["id" => "OTU_1", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 134097}}"]],
            ["id" => "OTU_2", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 163840}}"]],
            ["id" => "OTU_3", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 24718}}"]],
            ["id" => "OTU_4", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 73023}}"]],
            ["id" => "OTU_5", "metadata" => ["fennec" => "{\"test_data\": {\"fennec_id\": 23057}}"]]
        );
        $this->insert_full_user_data(array_merge($smallBiom, array('rows'=>$rows)),'UpdateProjectTestUser', new \DateTime('2016-10-06T08:07:40+0000'), 'updateProjectFile.biom');
    }

    private function insert_full_user_data($project, $oauth_id, $import_date, $import_filename)
    {
        $user_repo = $this->em->getRepository('AppBundle:FennecUser');
        $user = $user_repo->findOneBy(array('github_access_token' => $oauth_id));
        if ($user === null) {
            $user = new FennecUser();
            $user->setGithubAccessToken($oauth_id);
            $user->setUsername($oauth_id);
            $user->setPassword('frikadelle');
            $user->setEmail($oauth_id);
            $this->em->persist($user);
        }
        $p = new Project();
        $p->setProject($project);
        $p->setUser($user);
        $p->setImportDate($import_date);
        $p->setImportFilename($import_filename);
        $permission = new Permissions();
        $permission->setPermission('owner');
        $permission->setUser($user);
        $permission->setProject($p);
        $this->em->persist($permission);
        $this->em->persist($p);
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