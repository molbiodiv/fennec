<?php

namespace AppBundle\Repository;

use AppBundle\Entity\FennecUser;
use AppBundle\Entity\WebuserData;
use Doctrine\ORM\EntityRepository;

/**
 * WebuserDataRepository
 *
 * This class was generated by the PhpStorm "Php Annotations" Plugin. Add your own custom
 * repository methods below.
 */
class WebuserDataRepository extends EntityRepository
{
    public function getNumberOfProjects(FennecUser $user = null): int{
        if ($user === null) {
            return 0;
        }
        return count($this->findBy(['webuser' => $user]));
    }

    public function getDataForUser($userId) {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('IDENTITY(data.webuser) AS webuserId', 'data.webuserDataId', 'data.importDate', 'data.importFilename', 'data.project')
            ->from('AppBundle\Entity\WebuserData', 'data')
            ->where('data.webuser = :userId')
            ->setParameter('userId', $userId);
        $query = $qb->getQuery();
        return $query->getResult();
    }

    public function getDataForUserByProjectId($projectId, $userId) {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('IDENTITY(data.webuser) AS webuserId', 'data.webuserDataId', 'data.importDate', 'data.importFilename', 'data.project')
            ->from('AppBundle\Entity\WebuserData', 'data')
            ->where('data.webuser = :userId')
            ->andWhere('data.webuserDataId = :projectId')
            ->setParameter('userId', $userId)
            ->setParameter('projectId', $projectId);
        $query = $qb->getQuery();
        return $query->getResult();
    }
}
