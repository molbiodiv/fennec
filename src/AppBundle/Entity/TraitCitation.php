<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitCitation
 *
 * @ORM\Table(name="trait_citation", uniqueConstraints={@ORM\UniqueConstraint(name="trait_citation_citation_uniq", columns={"citation"})})
 * @ORM\Entity
 */
class TraitCitation
{
    /**
     * @var string
     *
     * @ORM\Column(name="citation", type="text", nullable=false)
     */
    private $citation;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="trait_citation_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;



    /**
     * Set citation.
     *
     * @param string $citation
     *
     * @return TraitCitation
     */
    public function setCitation($citation)
    {
        $this->citation = $citation;

        return $this;
    }

    /**
     * Get citation.
     *
     * @return string
     */
    public function getCitation()
    {
        return $this->citation;
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
