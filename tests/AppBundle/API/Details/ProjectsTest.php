<?php

namespace Test\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ProjectsTest extends WebserviceTestCase
{
    const NICKNAME = 'detailsProjectsTestUser';
    const USERID = 'detailsProjectsTestUser';
    const PROVIDER = 'detailsProjectsTestUser';

    public function testExecute()
    {
        //Test if the details of one project are returned correctly
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'projects');
        $listingProjects = $this->webservice->factory('listing', 'projects');
        $session = $this->session;
        $session->set('user',
            array(
                'nickname' => ProjectsTest::NICKNAME,
                'id' => ProjectsTest::USERID,
                'provider' => ProjectsTest::PROVIDER,
                'token' => 'UploadProjectTestUserToken'
            )
        );
        $entries = $listingProjects->execute(new ParameterBag(array('dbversion' => $default_db)), $session);
        $id = $entries['data'][0]['internal_project_id'];
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'ids' => array($id))), $session);
        $expected = '{'
            . '"id": "table_1", '
            . '"data": [[0, 0, 120.0], [3, 1, 12.0], [5, 2, 20.0], [7, 3, 12.7], [8, 4, 16.0]], '
            . '"date": "2016-05-03T08:13:41.848780", '
            . '"rows": [{"id": "OTU_1", "metadata": {}}, {"id": "OTU_2", "metadata": {}}, '
            . '{"id": "OTU_3", "metadata": {}}, {"id": "OTU_4", "metadata": {}}, '
            . '{"id": "OTU_5", "metadata": {}}, {"id": "OTU_6", "metadata": {}}, {"id": "OTU_7", "metadata": {}}, '
            . '{"id": "OTU_8", "metadata": {}}, {"id": "OTU_9", "metadata": {}}, {"id": "OTU_10", "metadata": {}}], '
            . '"type": "OTU table", '
            . '"shape": [10, 5], '
            . '"format": "Biological Observation Matrix 2.1.0", '
            . '"columns": [{"id": "Sample_1", "metadata": {}}, {"id": "Sample_2", "metadata": {}}, '
            . '{"id": "Sample_3", "metadata": {}}, {"id": "Sample_4", "metadata": {}}, '
            . '{"id": "Sample_5", "metadata": {}}], '
            . '"format_url": "http://biom-format.org", '
            . '"matrix_type": "sparse", '
            . '"generated_by": "BIOM-Format 2.1", '
            . '"matrix_element_type": "float"'
            . '}';
        $this->assertEquals($expected, $results['projects'][$id]['biom']);
        $this->assertEquals('2016-05-17 10:00:52.627236+00', $results['projects'][$id]['import_date']);
        $this->assertEquals(null, $results['projects'][$id]['import_filename']);
    }
}
