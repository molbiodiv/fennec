<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * TraitCategoricalEntryRepository
 *
 * This class was generated by the PhpStorm "Php Annotations" Plugin. Add your own custom
 * repository methods below.
 */
class TraitCategoricalEntryRepository extends EntityRepository
{
    public function getNumber(): int
    {
        $query = $this->getEntityManager()->createQuery('SELECT COUNT(t.id) FROM AppBundle\Entity\TraitCategoricalEntry t WHERE t.deletionDate IS NULL ');
        return $query->getSingleScalarResult();
    }
}