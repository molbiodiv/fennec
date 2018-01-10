<?php

namespace AppBundle\API\Details;

use AppBundle\Service\DBVersion;
use AppBundle\Entity\TraitCategoricalEntry;
use AppBundle\Entity\TraitFormat;
use AppBundle\Entity\TraitNumericalEntry;
use AppBundle\Entity\TraitType;

/**
 * Web Service.
 * Returns Trait information
 * <code>
 *   array(
 *     "values" => [
 *       "annual" => [2888, 109884],
 *       "perennial" => [46032, 6661, 25517]
 *     ],
 *     "trait_type_id" => 2,
 *     "name" => "Plant Life Cycle Habit",
 *     "ontology_url" => "http://purl.obolibrary.org/obo/TO_0002725",
 *     "trait_format" => "categorical_free",
 *     "number_of_organisms" => 5
 *   );
 * </code>
 */
class Traits
{

    private $manager;

    /**
     * Traits constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @param $include_citations
     * @returns array of traits
     */
    public function execute($trait_type_id, $fennec_ids, $include_citations)
    {
        $result = $this->manager->getRepository(TraitType::class)->getInfo($trait_type_id);
        $format = $this->manager->getRepository(TraitFormat::class)->getFormat($result['trait_format_id']);
        $result['format'] = $format['format'];
        $result['values'] = null;
        if ($fennec_ids !== null && count($fennec_ids) === 0) {
            $result['values'] = array();
            $result['numberOfOrganisms'] = 0;
        } else {
            if ($format['format'] === 'categorical_free') {
                $result['values'] = $this->manager->getRepository(TraitCategoricalEntry::class)->getValues($trait_type_id, $fennec_ids);
                $result['numberOfOrganisms'] = $this->manager->getRepository(TraitCategoricalEntry::class)->getNumberOfOrganisms($trait_type_id, $fennec_ids);
            } else {
                $result['values'] = $this->manager->getRepository(TraitNumericalEntry::class)->getValues($trait_type_id, $fennec_ids);
                $result['numberOfOrganisms'] = $this->manager->getRepository(TraitNumericalEntry::class)->getNumberOfOrganisms($trait_type_id, $fennec_ids);
            }
        }
        if ($include_citations) {
            if ($format['format'] === 'categorical_free') {
                $result['citations'] = $this->manager->getRepository(TraitCategoricalEntry::class)->getCitations($trait_type_id, $fennec_ids);
            } else {
                $result['citations'] = $this->manager->getRepository(TraitNumericalEntry::class)->getCitations($trait_type_id, $fennec_ids);
            }
        }
        return $result;
    }
}