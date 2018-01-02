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

    /**
     * @param $trait_type_id
     * @return array type, format, trait_type_id and ontology_url of specific trait
     */
    public function getInfo($trait_type_id){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('t.id AS trait_type_id', 't.type', 't.ontologyUrl', 'IDENTITY(t.traitFormat) AS trait_format_id', 't.description', 't.unit')
            ->from('AppBundle\Entity\TraitType', 't')
            ->where('t.id = :trait_type_id')
            ->setParameter('trait_type_id', $trait_type_id);
        $query = $qb->getQuery();
        return $query->getSingleResult();
    }
}
