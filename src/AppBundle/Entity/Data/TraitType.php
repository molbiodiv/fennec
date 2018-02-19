<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitType
 *
 * @ORM\Table(name="trait_type", uniqueConstraints={@ORM\UniqueConstraint(name="trait_type_type_uniq", columns={"type"})}, indexes={@ORM\Index(name="IDX_4778902CA8809D", columns={"trait_format_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\Data\TraitTypeRepository")
 */
class TraitType
{
    /**
     * @var string
     *
     * @ORM\Column(name="type", type="text", nullable=false)
     */
    private $type;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ontology_url", type="text", nullable=true)
     */
    private $ontologyUrl;

    /**
     * @var string|null
     *
     * @ORM\Column(name="unit", type="text", nullable=true)
     */
    private $unit;

    /**
     * @var string|null
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="trait_type_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var \AppBundle\Entity\Data\TraitFormat
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\TraitFormat")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="trait_format_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $traitFormat;

    /**
     *
     */
    public function __toString()
    {
        return "TraitType: ".$this->getType();
    }

    /**
     * Set type.
     *
     * @param string $type
     *
     * @return TraitType
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set ontologyUrl.
     *
     * @param string|null $ontologyUrl
     *
     * @return TraitType
     */
    public function setOntologyUrl($ontologyUrl = null)
    {
        $this->ontologyUrl = $ontologyUrl;

        return $this;
    }

    /**
     * Get ontologyUrl.
     *
     * @return string|null
     */
    public function getOntologyUrl()
    {
        return $this->ontologyUrl;
    }

    /**
     * Set description.
     *
     * @param string|null $description
     *
     * @return TraitType
     */
    public function setDescription($description = null)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description.
     *
     * @return string|null
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set traitFormat.
     *
     * @param \AppBundle\Entity\Data\TraitFormat|null $traitFormat
     *
     * @return TraitType
     */
    public function setTraitFormat(\AppBundle\Entity\Data\TraitFormat $traitFormat = null)
    {
        $this->traitFormat = $traitFormat;

        return $this;
    }

    /**
     * Get traitFormat.
     *
     * @return \AppBundle\Entity\Data\TraitFormat|null
     */
    public function getTraitFormat()
    {
        return $this->traitFormat;
    }

    /**
     * Set unit.
     *
     * @param string|null $unit
     *
     * @return TraitType
     */
    public function setUnit($unit = null)
    {
        $this->unit = $unit;

        return $this;
    }

    /**
     * Get unit.
     *
     * @return string|null
     */
    public function getUnit()
    {
        return $this->unit;
    }
}
