<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 22.01.18
 * Time: 16:08
 */

namespace AppBundle\Security\Voter;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProjectVoter extends Voter
{
    const VIEW = 'view';
    const EDIT = 'edit';
    const OWNER = 'owner';

    private $manager;

    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getUserEntityManager();
    }

    protected function supports($attribute, $projectId)
    {
        if (!in_array($attribute, array(self::VIEW, self::EDIT, self::OWNER))) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute($attribute, $projectId, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof FennecUser) {
            return false;
        }

        $project = $this->manager->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuserDataId' => $projectId
        ));

        switch ($attribute) {
            case self::VIEW:
             return $this->canView($project, $user);
            case self::EDIT:
                return $this->canEdit($project, $user);
            case self::OWNER:
                return $this->isOwner($project, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canView(Project $project, FennecUser $user)
    {
        if ($this->canEdit($project, $user)) {
            return true;
        }
        return 'view' === $this->getPermission($project, $user);
    }

    private function canEdit(Project $project, FennecUser $user)
    {
        if($this->isOwner($project, $user)){
            return true;
        }
        return 'edit' === $this->getPermission($project, $user);
    }

    private function isOwner(Project $project, FennecUser $user){
        return $user === $project->getWebuser();
    }

    private function getPermission(Project $project, FennecUser $user){
        $permission = $this->manager->getRepository('AppBundle:Permissions')->findOneBy(array(
            'webuserData' => $project->getWebuserDataId(),
            'webuser' => $user->getId()
        ));
        return $permission->getPermission();
    }
}