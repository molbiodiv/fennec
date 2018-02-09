<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * FennecDbxref
 *
 * @ORM\Table(name="fennec_dbxref", uniqueConstraints={@ORM\UniqueConstraint(name="fennec_dbxref_db_id_identifier_uniq", columns={"fennec_id", "db_id", "identifier"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\FennecDbxrefRepository")
 */
class FennecDbxref
{
    /**
     * @var string
     *
     * @ORM\Column(name="identifier", type="text", nullable=false)
     */
    private $identifier;

    /**
     * @var int
     *
     * @ORM\Column(name="fennec_dbxref_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="fennec_dbxref_fennec_dbxref_id_seq", allocationSize=1, initialValue=1)
     */
    private $fennecDbxrefId;

    /**
     * @var \AppBundle\Entity\Db
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Db")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="db_id", referencedColumnName="db_id", nullable=false)
     * })
     */
    private $db;

    /**
     * @var \AppBundle\Entity\Organism
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Organism")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="fennec_id", referencedColumnName="fennec_id", nullable=false)
     * })
     */
    private $fennec;



    /**
     * Set identifier.
     *
     * @param string $identifier
     *
     * @return FennecDbxref
     */
    public function setIdentifier($identifier)
    {
        $this->identifier = $identifier;

        return $this;
    }

    /**
     * Get identifier.
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * Get fennecDbxrefId.
     *
     * @return int
     */
    public function getFennecDbxrefId()
    {
        return $this->fennecDbxrefId;
    }

    /**
     * Set db.
     *
     * @param \AppBundle\Entity\Db|null $db
     *
     * @return FennecDbxref
     */
    public function setDb(\AppBundle\Entity\Db $db = null)
    {
        $this->db = $db;

        return $this;
    }

    /**
     * Get db.
     *
     * @return \AppBundle\Entity\Db|null
     */
    public function getDb()
    {
        return $this->db;
    }

    /**
     * Set fennec.
     *
     * @param \AppBundle\Entity\Organism|null $fennec
     *
     * @return FennecDbxref
     */
    public function setFennec(\AppBundle\Entity\Organism $fennec = null)
    {
        $this->fennec = $fennec;

        return $this;
    }

    /**
     * Get fennec.
     *
     * @return \AppBundle\Entity\Organism|null
     */
    public function getFennec()
    {
        return $this->fennec;
    }


}
