<?php

namespace fennecweb\ajax\upload;

use \fennecweb\WebService as WebService;

class AddOrganismIDsToProjectTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'AddOrganismIDsToProjectTestUser';
    const USERID = 'AddOrganismIDsToProjectTestUser';
    const PROVIDER = 'AddOrganismIDsToProjectTest';

    public function setUp()
    {
        $_SESSION['user'] = array(
            'nickname' => ProjectsTest::NICKNAME,
            'id' => ProjectsTest::USERID,
            'provider' => ProjectsTest::PROVIDER,
            'token' => 'AddOrganismIDsToProjectTestUserToken'
        );
    }

    public function testExecute()
    {
        $_FILES = array(
            array(
                'name' => 'empty',
                'type' => 'text/plain',
                'size' => 0,
                'tmp_name' => __DIR__ . '/testFiles/addOrganismIDsToProjectTest.json',
                'error' => 0
            )
        );
        list($service) = WebService::factory('upload/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        list($service) = WebService::factory('listing/Projects');
        $entries = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $id = $entries['data'][0]['internal_project_id'];
        list($service) = WebService::factory('edit/AddOrganismIDsToProject');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'id' => $id, 'method' => 'ncbi_taxid')));
        $this->assertEquals(10, $results['success']);
        list($service) = WebService::factory('details/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'ids' => array($id))));
        $rows = json_decode($results['projects'][$id])['rows'];
        function ncbi_taxid($row)
        {
            return($row['metadata']['ncbi_taxid']);
        }
        $actual_ncbi_taxids = array_map("ncbi_taxid", $rows);
        function organism_id($row)
        {
            return($row['metadata']['fennec_organism_id']);
        }
        $actual_organism_ids = array_map("organism_id", $rows);
        $expect_ncbi_taxids = array(722820,471708,1671960,634075,1137923,279054,267236,133362,161435,690802);
        $expect_organism_ids = array(16,17,18,21,23,26,27,30,31,32);
        $this->assertEquals($expect_ncbi_taxids, $actual_ncbi_taxids);
        $this->assertEquals($expect_organism_ids, $actual_organism_ids);
        $this->assertEquals('ncbi_taxid', $rows[3]['fennec_assignment_method']);
        $this->assertEquals(DEFAULT_DBVERSION, $rows[7]['fennec_dbversion']);
    }
}
