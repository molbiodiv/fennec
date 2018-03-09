<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;

/**
 * WebuserData
 *
 * @ORM\Table(name="webuser_data", indexes={@ORM\Index(name="IDX_EEEDEB2749279951", columns={"webuser_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\User\ProjectRepository")
 */
class Project
{
    /**
     * @var array
     *
     * @ORM\Column(name="project", type="json_array", nullable=false)
     */
    private $project;

    /**
     * @var string|null
     *
     * @ORM\Column(name="import_filename", type="text", nullable=true)
     */
    private $importFilename;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="import_date", type="datetime", nullable=true)
     */
    private $importDate = 'now()';

    /**
     * @var int
     *
     * @ORM\Column(name="webuser_data_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="webuser_data_id_seq", allocationSize=1, initialValue=1)
     */
    private $webuserDataId;

    /**
     * @var \AppBundle\Entity\User\FennecUser
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\FennecUser")
     * @ORM\JoinColumn(name="webuser_id", referencedColumnName="id", nullable=false)
     */
    private $webuser;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\User\Permissions", mappedBy="webuserData")
     */
    protected $permissions;

    /**
     * @param mixed $permissions
     */
    public function setPermissions($permissions)
    {
        $this->permissions = $permissions;
    }

    /**
     * @return mixed
     */
    public function getPermissions()
    {
        return $this->permissions;
    }

    public function __construct()
    {
        $this->setImportDate(new \DateTime());
    }

    /**
     * Set project.
     *
     * @param array $project
     *
     * @return Project
     */
    public function setProject($project)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project.
     *
     * @return array
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set importFilename.
     *
     * @param string|null $importFilename
     *
     * @return Project
     */
    public function setImportFilename($importFilename = null)
    {
        $this->importFilename = $importFilename;

        return $this;
    }

    /**
     * Get importFilename.
     *
     * @return string|null
     */
    public function getImportFilename()
    {
        return $this->importFilename;
    }

    /**
     * Set importDate.
     *
     * @param \DateTime|null $importDate
     *
     * @return Project
     */
    public function setImportDate($importDate = null)
    {
        $this->importDate = $importDate;

        return $this;
    }

    /**
     * Get importDate.
     *
     * @return \DateTime|null
     */
    public function getImportDate()
    {
        return $this->importDate;
    }

    /**
     * Get webuserDataId.
     *
     * @return int
     */
    public function getWebuserDataId()
    {
        return $this->webuserDataId;
    }

    /**
     * Set webuser.
     *
     * @param \AppBundle\Entity\User\FennecUser|null $webuser
     *
     * @return Project
     */
    public function setWebuser(\AppBundle\Entity\User\FennecUser $webuser = null)
    {
        $this->webuser = $webuser;

        return $this;
    }

    /**
     * Get webuser.
     *
     * @return \AppBundle\Entity\User\FennecUser|null
     */
    public function getWebuser()
    {
        return $this->webuser;
    }
}
