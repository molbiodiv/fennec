<?php

namespace AppBundle\API\Details;

use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;
use AppBundle\Entity\Organism;

/**
 * Web Service.
 * Returns trait information to a list of organism ids
 */
class TraitsOfOrganisms
{
    private $manager;

    /**
     * TraitsOfOrganisms constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @param 'fennec_ids' => [13,7,12,5]
     * @returns array $result
     * <code>
     * array(type_cvterm_id => array(
     * 'trait_type' => 'habitat',
     * 'trait_entry_ids' => array(1, 20, 36, 7),
     * 'fennec_ids' => array(13, 20, 5)
     * );
     * </code>
     */
    public function execute($fennec_ids)
    {
        return $this->manager->getRepository(Organism::class)->getTraits($fennec_ids);
    }
}
