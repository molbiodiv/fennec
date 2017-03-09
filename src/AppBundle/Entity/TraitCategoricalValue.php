<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitCategoricalValue
 *
 * @ORM\Table(name="trait_categorical_value", uniqueConstraints={@ORM\UniqueConstraint(name="trait_categorical_value_value_ontology_url_trait_type_id_uniq", columns={"value", "ontology_url", "trait_type_id"})}, indexes={@ORM\Index(name="IDX_EBAD7D52788909E7", columns={"trait_type_id"})})
 * @ORM\Entity
 */
class TraitCategoricalValue
{
    /**
     * @var string
     *
     * @ORM\Column(name="value", type="text", nullable=false)
     */
    private $value;

    /**
     * @var string
     *
     * @ORM\Column(name="ontology_url", type="text", nullable=false)
     */
    private $ontologyUrl = '';

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="trait_categorical_value_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var \AppBundle\Entity\TraitType
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\TraitType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="trait_type_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $traitType;



    /**
     * Set value.
     *
     * @param string $value
     *
     * @return TraitCategoricalValue
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value.
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Set ontologyUrl.
     *
     * @param string $ontologyUrl
     *
     * @return TraitCategoricalValue
     */
    public function setOntologyUrl($ontologyUrl)
    {
        $this->ontologyUrl = $ontologyUrl;

        return $this;
    }

    /**
     * Get ontologyUrl.
     *
     * @return string
     */
    public function getOntologyUrl()
    {
        return $this->ontologyUrl;
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
     * Set traitType.
     *
     * @param \AppBundle\Entity\TraitType|null $traitType
     *
     * @return TraitCategoricalValue
     */
    public function setTraitType(\AppBundle\Entity\TraitType $traitType = null)
    {
        $this->traitType = $traitType;

        return $this;
    }

    /**
     * Get traitType.
     *
     * @return \AppBundle\Entity\TraitType|null
     */
    public function getTraitType()
    {
        return $this->traitType;
    }
}
