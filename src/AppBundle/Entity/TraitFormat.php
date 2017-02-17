<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitFormat
 *
 * @ORM\Table(name="trait_format", uniqueConstraints={@ORM\UniqueConstraint(name="trait_format_format_uniq", columns={"format"})})
 * @ORM\Entity
 */
class TraitFormat
{
    /**
     * @var string
     *
     * @ORM\Column(name="format", type="text", nullable=false)
     */
    private $format;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="trait_format_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;



    /**
     * Set format.
     *
     * @param string $format
     *
     * @return TraitFormat
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * Get format.
     *
     * @return string
     */
    public function getFormat()
    {
        return $this->format;
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
}
