<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * NameType
 *
 * @ORM\Table(name="name_type", uniqueConstraints={@ORM\UniqueConstraint(name="name_type_uniq", columns={"name_type"})})
 * @ORM\Entity
 */
class NameType
{
    /**
     * @var string
     *
     * @ORM\Column(name="name_type", type="text", nullable=false)
     */
    private $nameType;

    /**
     * @var int
     *
     * @ORM\Column(name="name_type_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="name_type_name_type_id_seq", allocationSize=1, initialValue=1)
     */
    private $nameTypeId;



    /**
     * Set nameType.
     *
     * @param string $nameType
     *
     * @return NameType
     */
    public function setNameType($nameType)
    {
        $this->nameType = $nameType;

        return $this;
    }

    /**
     * Get nameType.
     *
     * @return string
     */
    public function getNameType()
    {
        return $this->nameType;
    }

    /**
     * Get nameTypeId.
     *
     * @return int
     */
    public function getNameTypeId()
    {
        return $this->nameTypeId;
    }
}
