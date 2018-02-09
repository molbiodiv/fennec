<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * AlternativeName
 *
 * @ORM\Table(name="alternative_name", indexes={@ORM\Index(name="IDX_18FE88FD594DA73F", columns={"fennec_id"}), @ORM\Index(name="IDX_18FE88FDCD27C92D", columns={"name_type_id"})})
 * @ORM\Entity
 */
class AlternativeName
{
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", nullable=false)
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="alternative_name_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="alternative_name_alternative_name_id_seq", allocationSize=1, initialValue=1)
     */
    private $alternativeNameId;

    /**
     * @var \AppBundle\Entity\Data\Organism
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\Organism")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="fennec_id", referencedColumnName="fennec_id", nullable=false)
     * })
     */
    private $fennec;

    /**
     * @var \AppBundle\Entity\Data\NameType
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\NameType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="name_type_id", referencedColumnName="name_type_id", nullable=false)
     * })
     */
    private $nameType;



    /**
     * Set name.
     *
     * @param string $name
     *
     * @return AlternativeName
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get alternativeNameId.
     *
     * @return int
     */
    public function getAlternativeNameId()
    {
        return $this->alternativeNameId;
    }

    /**
     * Set fennec.
     *
     * @param \AppBundle\Entity\Data\Organism|null $fennec
     *
     * @return AlternativeName
     */
    public function setFennec(\AppBundle\Entity\Data\Organism $fennec = null)
    {
        $this->fennec = $fennec;

        return $this;
    }

    /**
     * Get fennec.
     *
     * @return \AppBundle\Entity\Data\Organism|null
     */
    public function getFennec()
    {
        return $this->fennec;
    }

    /**
     * Set nameType.
     *
     * @param \AppBundle\Entity\Data\NameType|null $nameType
     *
     * @return AlternativeName
     */
    public function setNameType(\AppBundle\Entity\Data\NameType $nameType = null)
    {
        $this->nameType = $nameType;

        return $this;
    }

    /**
     * Get nameType.
     *
     * @return \AppBundle\Entity\Data\NameType|null
     */
    public function getNameType()
    {
        return $this->nameType;
    }
}
