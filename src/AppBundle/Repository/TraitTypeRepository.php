<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * TraitTypeRepository
 *
 * This class was generated by the PhpStorm "Php Annotations" Plugin. Add your own custom
 * repository methods below.
 */
class TraitTypeRepository extends EntityRepository
{
    public function getNumber(){
        $query = $this->getEntityManager()->createQuery('SELECT COUNT(tt.id) FROM AppBundle\Entity\TraitType tt');
        return $query->getSingleScalarResult();
    }
}
