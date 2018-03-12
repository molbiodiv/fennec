<?php

namespace AppBundle\API\Details;

use AppBundle\Entity\Data\TraitCategoricalEntry;
use AppBundle\Entity\Data\TraitNumericalEntry;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Returns Trait Entry information
 */
class TraitEntries
{
    private $manager;
    private $known_trait_formats;
    const ERROR_UNKNOWN_TRAIT_FORMAT = "Error. Unknown trait_format.";

    /**
     * TraitEntries constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getDataEntityManager();
        $this->known_trait_formats = array('categorical_free', 'numerical');
    }


    /**
     * @param $traitFormat
     * @param $traitEntryIds
     * @returns array with details of the requested trait entries
     */
    public function execute($traitEntryIds, $traitFormat)
    {
        if (!in_array($traitFormat, $this->known_trait_formats)) {
            return (array('error' => TraitEntries::ERROR_UNKNOWN_TRAIT_FORMAT));
        }
        if ($traitFormat === "categorical_free") {
            $result = $this->manager->getRepository(TraitCategoricalEntry::class)->getTraitEntry($traitEntryIds);
        } else {
            $result = $this->manager->getRepository(TraitNumericalEntry::class)->getTraitEntry($traitEntryIds);
        }
        return $result;
    }
}
