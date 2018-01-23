<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 22.01.18
 * Time: 16:08
 */

namespace AppBundle\Security\Voter;

use AppBundle\Entity\WebuserData;
use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProjectVoter extends Voter
{
    // these strings are just invented: you can use anything
    const VIEW = 'view';
    const EDIT = 'edit';
    const OWNER = 'owner';

    private $manager;

    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    protected function supports($attribute, $projectId)
    {
        // if the attribute isn't one we support, return false
        if (!in_array($attribute, array(self::VIEW, self::EDIT))) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute($attribute, $projectId, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof FennecUser) {
            // the user must be logged in; if not, deny access
            return false;
        }

        // you know $subject is a Post object, thanks to supports
        /** @var WebuserData $post */
        $project = $this->manager->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuserDataId' => $projectId,
            'webuser' => $user->getId()
        ));

        switch ($attribute) {
            case self::VIEW:
             return $this->canView($project, $user);
            case self::EDIT:
                return $this->canEdit($project, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canView(WebuserData $project, FennecUser $user)
    {
        // if they can edit, they can view
        if ($this->canEdit($project, $user)) {
            return true;
        }

        // the Post object could have, for example, a method isPrivate()
        // that checks a boolean $private property
        return !$project->isPrivate();
    }

    private function canEdit(WebuserData $project, $user)
    {
        // this assumes that the data object has a getOwner() method
        // to get the entity of the user who owns this data object
        return $user === $project->getWebuser();
    }
}