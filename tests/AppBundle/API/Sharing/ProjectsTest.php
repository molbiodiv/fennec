<?php

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Sharing;
use AppBundle\API\Upload;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Permissions;
use AppBundle\Entity\User\Project;

class ProjectsTest extends WebserviceTestCase
{
    private $em;
    private $sharingProjects;
    private $uploadProjects;

    const NICKNAME = 'SharingProjectsTestUser';
    const EMAIL = 'SharingProjectsTestUser@bla.de';
    const PASSWORD = 'SharingProjectsTestPassword';
    const ANOTHER_NICKNAME = 'AnotherSharingProjectsTestUser';
    const ANOTHER_EMAIL = 'AnotherSharingProjectsTestUser@bla.de';

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_user');
        $this->sharingProjects = $kernel->getContainer()->get(Sharing\Projects::class);
        $this->uploadProjects = $kernel->getContainer()->get(Upload\Projects::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testSharingOfProject(){
        $user = new FennecUser();
        $user->setUsername(ProjectsTest::NICKNAME);
        $user->setEmail(ProjectsTest::EMAIL);
        $user->setPassword(ProjectsTest::PASSWORD);
        $anotherUser = new FennecUser();
        $anotherUser->setUsername(ProjectsTest::ANOTHER_NICKNAME);
        $anotherUser->setEmail(ProjectsTest::ANOTHER_EMAIL);
        $anotherUser->setPassword(ProjectsTest::PASSWORD);

        //Upload test data for SharingProjectsTestUser and AnotherSharingProjectsTestUser
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

        //Test if both users have the permission 'owner' on their own projects
        $permission = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $user
        ));
        $anotherPermission = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->assertEquals('owner', $permission->getPermission());
        $this->assertEquals('owner', $anotherPermission->getPermission());


        $project = $this->em->getRepository(Project::class)->findOneBy(array(
            'webuser' => $user
        ));
        $anotherProject = $this->em->getRepository(Project::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));

        //Test for error message if there is no user for the email
        $result = $this->sharingProjects->execute('thisIsNotValid@example.com', $project->getWebuserDataId(), 'view');
        $this->assertTrue($result['error']);
        $this->assertEquals('There exists no user for the email: thisIsNotValid@example.com', $result['message']);

        //Add permission 'view' for project to AnotherProjectsTestUser
        $this->sharingProjects->execute(ProjectsTest::ANOTHER_EMAIL, $project->getWebuserDataId(), 'view');
        $permissionAfterShare = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->assertEquals('view', $permissionAfterShare->getPermission());

        //Add permission 'edit' for anotherProject to ProjectsTestUser
        $this->sharingProjects->execute(ProjectsTest::EMAIL, $anotherProject->getWebuserDataId(), 'edit');
        $anotherPermissionAfterShare = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $user
        ));
        $this->assertEquals('edit', $anotherPermissionAfterShare->getPermission());

        //Add permission 'edit' for project to AnotherProjectsTestUser
        $project = $this->em->getRepository(Project::class)->findOneBy(array(
            'webuser' => $user
        ));
        $this->sharingProjects->execute(ProjectsTest::ANOTHER_EMAIL, $project->getWebuserDataId(), 'edit');
        $permissionAfterShare = $this->em->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $anotherUser
        ));
        $this->assertEquals('edit', $permissionAfterShare->getPermission());

    }
}