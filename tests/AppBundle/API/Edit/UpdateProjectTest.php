<?php

namespace Tests\AppBundle\API\Edit;

use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class UpdateProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'UpdateProjectTestUser';
    const USERID = 'UpdateProjectTestUser';
    const PROVIDER = 'UpdateProjectTestUser';
    const TOKEN = 'UpdateProjectTestToken';

    public function testExecute(){
        $service = $this->webservice->factory('edit', 'updateProject');
        $this->user = new FennecUser(UpdateProjectTest::USERID,UpdateProjectTest::NICKNAME,UpdateProjectTest::PROVIDER);
        $listingProject = $this->webservice->factory('listing', 'projects');
        $entries = $listingProject->execute(new ParameterBag(array('dbversion' => $this->default_db)), $this->user);
        $id = $entries['data'][0]['internal_project_id'];
        $detailsProject = $this->webservice->factory('details', 'projects');
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $this->user
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('table_1', $biom['id']);
        $this->assertFalse(array_key_exists('comment', $biom));
        // Now update the project
        $biom['id'] = 'Updated ID';
        $biom['comment'] = 'New comment';
        $results = $service->execute(
            new ParameterBag(array(
                'dbversion' => $this->default_db,
                'biom' => json_encode($biom),
                'project_id' => $id
            )),
            $this->user
        );
        $this->assertNull($results['error']);
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $this->user
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('Updated ID', $biom['id']);
        $this->assertEquals('New comment', $biom['comment']);
    }
}