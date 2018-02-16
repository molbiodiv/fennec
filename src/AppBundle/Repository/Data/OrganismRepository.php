<?php

namespace AppBundle\Repository\Data;

use Doctrine\ORM\EntityRepository;

/**
 * OrganismRepository
 *
 * This class was generated by the PhpStorm "Php Annotations" Plugin. Add your own custom
 * repository methods below.
 */
class OrganismRepository extends EntityRepository
{
    public function getNumber(): int {
        $query = $this->getEntityManager()->createQuery('SELECT COUNT(o.fennecId) FROM AppBundle\Entity\Data\Organism o');
        return $query->getSingleScalarResult();
    }

    public function getListOfOrganisms($limit, $search): array {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('organism.fennecId', 'organism.scientificName')
            ->from('AppBundle\Entity\Data\Organism', 'organism')
            ->where('LOWER(organism.scientificName) LIKE LOWER(:search)')
            ->setParameter('search', $search)
            ->setMaxResults($limit);
        $query = $qb->getQuery();
        return $query->getResult();
    }

    public function getDetailsOfOrganism($fennec_id){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('organism')
            ->from('AppBundle\Entity\Data\Organism','organism')
            ->where('organism.fennecId = :id')
            ->setParameter('id', $fennec_id);
        $query = $qb->getQuery();
        $result = $query->getArrayResult();

        $data = array();
        $data['fennec_id'] = $result[0]['fennecId'];
        $data['scientific_name'] = $result[0]['scientificName'];
        $data['eol_identifier'] = $this->getIdentifierDbxref($result[0]['fennecId'], 'EOL');
        $data['ncbi_identifier'] = $this->getIdentifierDbxref($result[0]['fennecId'], 'ncbi_taxonomy');
        return $data;
    }

    /**
     * @param int $fennec_id
     * @param string $db_name
     * @return string $identifier identifier of the current organism in the defined database
     */
    private function getIdentifierDbxref($fennec_id, $db_name)
    {
        $db_id = $this->getDBId($db_name);
        return $this->getIdentifier($fennec_id, $db_id);
    }

    private function getDBId($db_name){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('db.id')
            ->from('AppBundle\Entity\Data\Db', 'db')
            ->where('db.name = :dbName')
            ->setParameter('dbName', $db_name);
        $query = $qb->getQuery();
        $result = $query->getArrayResult();
        for($i=0; $i < sizeof($result); $i++) {
            $db_id = $result[$i]['id'];
        }
        if (!isset($db_id)) {
            return "";
        }
        return $db_id;
    }

    private function getIdentifier($fennec_id, $db_id)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('d.identifier')
            ->from('AppBundle\Entity\Data\FennecDbxref', 'd')
            ->where('d.db = :dbId')
            ->andWhere('d.fennec = :fennecId')
            ->setParameter('dbId', $db_id)
            ->setParameter('fennecId', $fennec_id);

        $query = $qb->getQuery();
        $result = $query->getArrayResult();
        for ($i = 0; $i < sizeof($result); $i++) {
            $identifier = $result[$i]['identifier'];
        }
        if (!isset($identifier)) {
            return "";
        }
        return $identifier;
    }

    public function getTraits($fennec_ids){
        $categoricalTraits = $this->getCategoricalTraits($fennec_ids);
        $numericalTraits = $this->getNumericalTraits($fennec_ids);
        $data = array_merge($categoricalTraits, $numericalTraits);
        $result = array();
        for($i=0;$i<sizeof($data);$i++) {
            $trait_type = $data[$i]['traitType'];
            $type_cvterm_id = $data[$i]['traitTypeId'];
            $trait_format = $data[$i]['format'];
            $fennec_id = $data[$i]['fennec'];
            $trait_entry_id = $data[$i]['id'];
            $unit = $data[$i]['unit'];
            if (!array_key_exists($type_cvterm_id, $result)) {
                $result[$type_cvterm_id] = [
                    'traitType' => $trait_type,
                    'traitFormat' => $trait_format,
                    'traitEntryIds' => [$trait_entry_id],
                    'fennec' => [$fennec_id],
                    'unit' => $unit
                ];
            } else {
                array_push($result[$type_cvterm_id]['traitEntryIds'], $trait_entry_id);
                if (!in_array($fennec_id, $result[$type_cvterm_id]['fennec'])) {
                        array_push($result[$type_cvterm_id]['fennec'], $fennec_id);
                    }
            }
        }
        return $result;
    }

    private function getCategoricalTraits($fennec_ids){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('t.id', 'IDENTITY(t.fennec) AS fennec', 'IDENTITY(t.traitType) AS traitTypeId', 'ttype.type AS traitType','ttype.unit','tformat.format')
            ->from('AppBundle\Entity\Data\TraitCategoricalEntry', 't')
            ->innerJoin('AppBundle\Entity\Data\TraitType','ttype','WITH', 't.traitType = ttype.id')
            ->innerJoin('AppBundle\Entity\Data\TraitFormat','tformat','WITH', 'ttype.traitFormat = tformat.id')
            ->where('t.deletionDate IS NULL')
            ->andWhere('t.fennec IN (:fennec_ids)')
            ->setParameter('fennec_ids', $fennec_ids);
        $query = $qb->getQuery();
        return $query->getResult();
    }

    private function getNumericalTraits($fennec_ids){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('t.id', 'IDENTITY(t.fennec) AS fennec', 'IDENTITY(t.traitType) AS traitTypeId', 'ttype.type AS traitType','ttype.unit','tformat.format')
            ->from('AppBundle\Entity\Data\TraitNumericalEntry', 't')
            ->innerJoin('AppBundle\Entity\Data\TraitType','ttype','WITH', 't.traitType = ttype.id')
            ->innerJoin('AppBundle\Entity\Data\TraitFormat','tformat','WITH', 'ttype.traitFormat = tformat.id')
            ->where('t.deletionDate IS NULL')
            ->andWhere('t.fennec IN (:fennecIds)')
            ->setParameter('fennecIds', $fennec_ids);
        $query = $qb->getQuery();
        return $query->getResult();
    }

    public function getOrganismByTrait($trait_type_id, $limit){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('DISTINCT IDENTITY(t.fennec) AS fennecId', 'o.scientificName')
            ->from('AppBundle\Entity\Data\TraitCategoricalEntry', 't')
            ->innerJoin('AppBundle\Entity\Data\Organism','o','WITH', 't.fennec = o.fennecId')
            ->where('t.traitType = :traitTypeId')
            ->setParameter('traitTypeId', $trait_type_id)
            ->setMaxResults($limit)
            ->expr()->isNull('t.deletionDate');
        $query = $qb->getQuery();
        $idsFromCategoricalTraits = $query->getResult();

        $this->getEntityManager()->clear();

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('DISTINCT IDENTITY(t.fennec) AS fennecId', 'o.scientificName')
            ->from('AppBundle\Entity\Data\TraitNumericalEntry', 't')
            ->innerJoin('AppBundle\Entity\Data\Organism','o','WITH', 't.fennec = o.fennecId')
            ->where('t.traitType = :traitTypeId')
            ->setParameter('traitTypeId', $trait_type_id)
            ->setMaxResults($limit)
            ->expr()->isNull('t.deletionDate');
        $query = $qb->getQuery();
        $idsFromNumericalTraits = $query->getResult();
        return array_merge($idsFromCategoricalTraits, $idsFromNumericalTraits);
    }

    public function getScientificNamesToFennecids($ids){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('o.fennecId', 'o.scientificName')
            ->from('AppBundle\Entity\Data\Organism', 'o')
            ->where('o.fennecId IN (:ids)')
            ->setParameter('ids', $ids);
        $query = $qb->getQuery();
        $result = $query->getResult();
        $data = array();
        for($i=0; $i < sizeof($result); $i++){
            $data[$result[$i]['fennecId']] = $result[$i]['scientificName'];
        }
        return $data;
    }

    public function getFennecIdsToScientificNames($scinames){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('o.fennecId', 'o.scientificName')
            ->from('AppBundle\Entity\Data\Organism', 'o')
            ->where('o.scientificName IN (:scinames)')
            ->setParameter('scinames', $scinames);
        $query = $qb->getQuery();
        $result = $query->getResult();
        $data = array_fill_keys($scinames, null);;
        for($i=0;$i<sizeof($result);$i++){
            $name = $result[$i]['scientificName'];
            if($data[$name] === null){
                $data[$name] = $result[$i]['fennecId'];
            } else {
                if(!is_array($data[$name]) ){
                    $data[$name] = [$data[$name]];
                }
                $data[$name][] = $result[$i]['fennecId'];
            }
        }
        return $data;
    }

    public function getFullIds(){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('o.fennecId', 'o.scientificName')
            ->from('AppBundle\Entity\Data\Organism', 'o');
        $query = $qb->getQuery();
        $result = $query->getResult();
        $data = array();
        for($i=0;$i<sizeof($result);$i++){
            $name = $result[$i]['scientificName'];
            if(!array_key_exists($name, $data)){
                $data[$result[$i]['scientificName']] = $result[$i]['fennecId'];
            } else {
                if(! is_array($data[$name]) ){
                    $data[$name] = [$data[$name]];
                }
                $data[$name][] = $result[$i]['fennecId'];
            }
        }
        return $data;
    }
}
