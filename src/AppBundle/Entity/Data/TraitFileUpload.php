<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * TraitFileUpload
 *
 * @ORM\Table(name="trait_file_upload")
 * @ORM\Entity()
 */
class TraitFileUpload
{
    /**
     * @var string
     *
     * @ORM\Column(name="filename", type="text", nullable=false)
     */
    private $filename;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="import_date", type="date", nullable=false)
     */
    private $importDate = 'now()';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="deletion_date", type="date", nullable=true)
     */
    private $deletionDate;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="trait_file_upload_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="fennec_user_id", type="integer", nullable=false)
     */
    private $fennecUserId;

    /**
     * @ORM\OneToMany(targetEntity="TraitNumericalEntry", mappedBy="id")
     */
    private $numericalTraitEntries;

    /**
     * @ORM\OneToMany(targetEntity="TraitCategoricalEntry", mappedBy="id")
     */
    private $categoricalTraitEntries;

    /**
     * @return string
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * @param string $filename
     */
    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

    /**
     * @return \DateTime
     */
    public function getImportDate()
    {
        return $this->importDate;
    }

    /**
     * @param \DateTime $importDate
     */
    public function setImportDate($importDate)
    {
        $this->importDate = $importDate;
    }

    /**
     * @return \DateTime|null
     */
    public function getDeletionDate()
    {
        return $this->deletionDate;
    }

    /**
     * @param \DateTime|null $deletionDate
     */
    public function setDeletionDate($deletionDate)
    {
        $this->deletionDate = $deletionDate;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getFennecUserId()
    {
        return $this->fennecUserId;
    }

    /**
     * @param int $fennecUserId
     */
    public function setFennecUserId($fennecUserId)
    {
        $this->fennecUserId = $fennecUserId;
    }

    /**
     * @return mixed
     */
    public function getNumericalTraitEntries()
    {
        return $this->numericalTraitEntries;
    }

    /**
     * @param mixed $numericalTraitEntries
     */
    public function setNumericalTraitEntries($numericalTraitEntries)
    {
        $this->numericalTraitEntries = $numericalTraitEntries;
    }

    /**
     * @return mixed
     */
    public function getCategoricalTraitEntries()
    {
        return $this->categoricalTraitEntries;
    }

    /**
     * @param mixed $categoricalTraitEntries
     */
    public function setCategoricalTraitEntries($categoricalTraitEntries)
    {
        $this->categoricalTraitEntries = $categoricalTraitEntries;
    }

}
