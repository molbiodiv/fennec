<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;

/**
 * Project
 *
 * @ORM\Table(name="project", indexes={@ORM\Index(name="IDX_EEEDEB2749279951", columns={"user_id"})})
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
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="project_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var \AppBundle\Entity\User\FennecUser
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\FennecUser")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\User\Permissions", mappedBy="project")
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
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set user.
     *
     * @param \AppBundle\Entity\User\FennecUser|null $user
     *
     * @return Project
     */
    public function setUser(\AppBundle\Entity\User\FennecUser $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user.
     *
     * @return \AppBundle\Entity\User\FennecUser|null
     */
    public function getUser()
    {
        return $this->user;
    }
}
