<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Db
 *
 * @ORM\Table(name="db", uniqueConstraints={@ORM\UniqueConstraint(name="db_name_uniq", columns={"name"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\DbRepository")
 */
class Db
{
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", nullable=false)
     */
    private $name;

    /**
     * @var string|null
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date", nullable=false)
     */
    private $date = 'now()';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="deletion_date", type="date", nullable=true)
     */
    private $deletionDate;

    /**
     * @var int
     *
     * @ORM\Column(name="db_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="db_db_id_seq", allocationSize=1, initialValue=1)
     */
    private $dbId;



    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Db
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
     * Set description.
     *
     * @param string|null $description
     *
     * @return Db
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
     * Set date.
     *
     * @param \DateTime $date
     *
     * @return Db
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date.
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set deletionDate.
     *
     * @param \DateTime|null $deletionDate
     *
     * @return Db
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
     * Get dbId.
     *
     * @return int
     */
    public function getDbId()
    {
        return $this->dbId;
    }
}
