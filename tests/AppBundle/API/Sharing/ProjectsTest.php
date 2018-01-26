<?php

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Sharing;
use AppBundle\API\Upload;
use AppBundle\Entity\FennecUser;
use AppBundle\Entity\Permissions;
use AppBundle\Entity\WebuserData;

class ProjectsTest extends WebserviceTestCase
{
    private $em;
    private $sharingProjects;
    private $uploadProjects;

    const NICKNAME = 'SharingProjectsTestUser';
    const EMAIL = 'SharingProjectsTestUser@bla.de';
    const ANOTHER_NICKNAME = 'AnotherSharingProjectsTestUser';
    const ANOTHER_EMAIL = 'AnotherSharingProjectsTestUser@bla.de';

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->sharingProjects = $kernel->getContainer()->get(Sharing\Projects::class);
        $this->uploadProjects = $kernel->getContainer()->get(Upload\Projects::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testReadOnlySharingOfProject(){
        $user = new FennecUser();
        $user->setUsername(ProjectsTest::NICKNAME);
        $user->setEmail(ProjectsTest::EMAIL);
        $anotherUser = new FennecUser();
        $anotherUser->setUsername(ProjectsTest::ANOTHER_NICKNAME);
        $anotherUser->setEmail(ProjectsTest::ANOTHER_EMAIL);
        $_FILES = array(
            array(
                'name' => 'simpleBiom.json',
                'type' => 'text/plain',
                'size' => 1067,
                'tmp_name' => __DIR__ . '/testFiles/simpleBiom.json',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($user);
        $_FILES = array(
            array(
                'name' => 'anotherSimpleBiom.json',
                'type' => 'text/plain',
                'size' => 1067,
                'tmp_name' => __DIR__ . '/testFiles/simpleBiom.json',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($anotherUser);
        $permission = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $user
        ));
        $anotherPermission = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->assertEquals('owner', $permission->getPermission());
        $this->assertEquals('owner', $anotherPermission->getPermission());
        $project = $this->em->getRepository(WebuserData::class)->findOneBy(array(
            'webuser' => $user
        ));
        $anotherProject = $this->em->getRepository(WebuserData::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->sharingProjects->execute(ProjectsTest::ANOTHER_EMAIL, $project->getWebuserDataId(), 'view');
        $permissionAfterShare = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->assertEquals('view', $permissionAfterShare->getPermission());
        $this->sharingProjects->execute(ProjectsTest::EMAIL, $anotherProject->getWebuserDataId(), 'edit');
        $anotherPermissionAfterShare = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $user
        ));
        $this->assertEquals('edit', $anotherPermissionAfterShare->getPermission());
    }
}