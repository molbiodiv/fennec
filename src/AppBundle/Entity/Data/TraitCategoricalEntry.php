<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitCategoricalEntry
 *
 * @ORM\Table(name="trait_categorical_entry")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\Data\TraitCategoricalEntryRepository")
 */
class TraitCategoricalEntry
{
    function __construct()
    {
        $this->creationDate = new \DateTime();
    }

    /**
     * @var bool
     *
     * @ORM\Column(name="private", type="boolean", nullable=false)
     */
    private $private;

    /**
     * @var string|null
     *
     * @ORM\Column(name="origin_url", type="text", nullable=true)
     */
    private $originUrl;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="creation_date", type="datetimetz", nullable=false)
     */
    private $creationDate = 'now()';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="deletion_date", type="datetimetz", nullable=true)
     */
    private $deletionDate;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="trait_categorical_entry_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

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
     * @var \AppBundle\Entity\Data\TraitCategoricalValue
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\TraitCategoricalValue")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="trait_categorical_value_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $traitCategoricalValue;

    /**
     * @var \AppBundle\Entity\Data\TraitCitation
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\TraitCitation")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="trait_citation_id", referencedColumnName="id")
     * })
     */
    private $traitCitation;

    /**
     * @var \AppBundle\Entity\Data\TraitType
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\TraitType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="trait_type_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $traitType;

    /**
     * @var \AppBundle\Entity\Data\Db
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Data\Db")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="db_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $db;

    /**
     * @ORM\ManyToOne(targetEntity="TraitFileUpload", inversedBy="categoricalTraitEntries")
     * @ORM\JoinColumn(name="trait_file_upload_id", referencedColumnName="id")
     */
    private $traitFileUpload;

    /**
     * @return mixed
     */
    public function getTraitFileUpload()
    {
        return $this->traitFileUpload;
    }

    /**
     * @param mixed $traitFileUpload
     */
    public function setTraitFileUpload($traitFileUpload)
    {
        $this->traitFileUpload = $traitFileUpload;
    }

    /**
     * @return Db
     */
    public function getDb()
    {
        return $this->db;
    }

    /**
     * @param Db $db
     */
    public function setDb($db)
    {
        $this->db = $db;
    }



    /**
     * Set private.
     *
     * @param bool $private
     *
     * @return TraitCategoricalEntry
     */
    public function setPrivate($private)
    {
        $this->private = $private;

        return $this;
    }

    /**
     * Get private.
     *
     * @return bool
     */
    public function getPrivate()
    {
        return $this->private;
    }

    /**
     * Set originUrl.
     *
     * @param string|null $originUrl
     *
     * @return TraitCategoricalEntry
     */
    public function setOriginUrl($originUrl = null)
    {
        $this->originUrl = $originUrl;

        return $this;
    }

    /**
     * Get originUrl.
     *
     * @return string|null
     */
    public function getOriginUrl()
    {
        return $this->originUrl;
    }

    /**
     * Set creationDate.
     *
     * @param \DateTime $creationDate
     *
     * @return TraitCategoricalEntry
     */
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * Get creationDate.
     *
     * @return \DateTime
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * Set deletionDate.
     *
     * @param \DateTime|null $deletionDate
     *
     * @return TraitCategoricalEntry
     */
    public function setDeletionDate($deletionDate = null)
    {
        $this->deletionDate = $deletionDate;

        return $this;
    }

    /**
     * Get deletionDate.
     *
     * @return \DateTime|null
     */
    public function getDeletionDate()
    {
        return $this->deletionDate;
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
     * Set fennec.
     *
     * @param \AppBundle\Entity\Data\Organism|null $fennec
     *
     * @return TraitCategoricalEntry
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
     * Set traitCategoricalValue.
     *
     * @param \AppBundle\Entity\Data\TraitCategoricalValue|null $traitCategoricalValue
     *
     * @return TraitCategoricalEntry
     */
    public function setTraitCategoricalValue(\AppBundle\Entity\Data\TraitCategoricalValue $traitCategoricalValue = null)
    {
        $this->traitCategoricalValue = $traitCategoricalValue;

        return $this;
    }

    /**
     * Get traitCategoricalValue.
     *
     * @return \AppBundle\Entity\Data\TraitCategoricalValue|null
     */
    public function getTraitCategoricalValue()
    {
        return $this->traitCategoricalValue;
    }

    /**
     * Set traitCitation.
     *
     * @param \AppBundle\Entity\Data\TraitCitation|null $traitCitation
     *
     * @return TraitCategoricalEntry
     */
    public function setTraitCitation(\AppBundle\Entity\Data\TraitCitation $traitCitation = null)
    {
        $this->traitCitation = $traitCitation;

        return $this;
    }

    /**
     * Get traitCitation.
     *
     * @return \AppBundle\Entity\Data\TraitCitation|null
     */
    public function getTraitCitation()
    {
        return $this->traitCitation;
    }

    /**
     * Set traitType.
     *
     * @param \AppBundle\Entity\Data\TraitType|null $traitType
     *
     * @return TraitCategoricalEntry
     */
    public function setTraitType(\AppBundle\Entity\Data\TraitType $traitType = null)
    {
        $this->traitType = $traitType;

        return $this;
    }

    /**
     * Get traitType.
     *
     * @return \AppBundle\Entity\Data\TraitType|null
     */
    public function getTraitType()
    {
        return $this->traitType;
    }
}
