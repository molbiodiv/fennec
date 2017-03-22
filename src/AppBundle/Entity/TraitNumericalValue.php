<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitNumericalValue
 *
 * @ORM\Table(name="trait_numerical_value")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TraitNumericalValueRepository")
 */
class TraitNumericalValue
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="value", type="decimal", precision=10, scale=0)
     */
    private $value;

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
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set value.
     *
     * @param string $value
     *
     * @return TraitNumericalValue
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
     * Set traitType.
     *
     * @param \AppBundle\Entity\TraitType $traitType
     *
     * @return TraitNumericalValue
     */
    public function setTraitType(\AppBundle\Entity\TraitType $traitType)
    {
        $this->traitType = $traitType;

        return $this;
    }

    /**
     * Get traitType.
     *
     * @return \AppBundle\Entity\TraitType
     */
    public function getTraitType()
    {
        return $this->traitType;
    }
}
