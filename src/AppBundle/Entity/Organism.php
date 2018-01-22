<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Organism
 *
 * @ORM\Table(name="organism")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\OrganismRepository")
 */
class Organism
{
    /**
     * @var string
     *
     * @ORM\Column(name="scientific_name", type="text", nullable=false)
     */
    private $scientificName;

    /**
     * @var int
     *
     * @ORM\Column(name="fennec_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="organism_fennec_id_seq", allocationSize=1, initialValue=1)
     */
    private $fennecId;



    /**
     * Set scientificName.
     *
     * @param string $scientificName
     *
     * @return Organism
     */
    public function setScientificName($scientificName)
    {
        $this->scientificName = $scientificName;

        return $this;
    }

    /**
     * Get scientificName.
     *
     * @return string
     */
    public function getScientificName()
    {
        return $this->scientificName;
    }

    /**
     * Get fennecId.
     *
     * @return int
     */
    public function getFennecId()
    {
        return $this->fennecId;
    }
}
