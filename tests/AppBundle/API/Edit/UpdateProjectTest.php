<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 21.10.16
 * Time: 09:49
 */

namespace Tests\AppBundle\API\Edit;


use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class UpdateProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'UpdateProjectTestUser';
    const USERID = 'UpdateProjectTestUser';
    const PROVIDER = 'UpdateProjectTest';
    const TOKEN = 'UpdateProjectTestToken';

    public function testExecute(){
        $service = $this->webservice->factory('edit', 'updateProject');
        $this->session->set('user', array(
            'nickname' => UpdateProjectTest::NICKNAME,
            'id' => UpdateProjectTest::USERID,
            'provider' => UpdateProjectTest::PROVIDER,
            'token' => UpdateProjectTest::TOKEN
        ));
        $listingProject = $this->webservice->factory('listing', 'projects');
        $entries = $listingProject->execute(new ParameterBag(array('dbversion' => $this->default_db)), $this->session);
        $id = $entries['data'][0]['internal_project_id'];
        $detailsProject = $this->webservice->factory('details', 'projects');
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $this->session
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('Original ID', $biom['id']);
        $this->assertFalse(array_key_exists('comment', $biom));
        // Now update the project
        $biom['id'] = 'Updated ID';
        $biom['comment'] = 'New comment';
        $service->execute(
            new ParameterBag(array(
                'dbversion' => $this->default_db,
                'biom' => json_encode($biom),
                'project_id' => $id
            )),
            $this->session
        );
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $this->session
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('Updated ID', $biom['id']);
        $this->assertEquals('New comment', $biom['comment']);
    }
}