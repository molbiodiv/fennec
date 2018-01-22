<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\Table(name="permissions", uniqueConstraints={@ORM\UniqueConstraint(name="db_name_uniq", columns={"name"})})
 */
class Permissions
{
    /**
     * @var \AppBundle\Entity\FennecUser
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\FennecUser")
     * @ORM\JoinColumn(name="webuser_id", referencedColumnName="id", nullable=false)
     */
    private $webuser;

    /**
     * @ORM\Column(type="string")
     */
    private $permission;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\WebuserData")
     * @ORM\JoinColumn(name="webuser_data_id", referencedColumnName="id", nullable=false)
     */
    private $webuserDataId;

    /**
     * @return FennecUser
     */
    public function getWebuser()
    {
        return $this->webuser;
    }

    /**
     * @return mixed
     */
    public function getPermission()
    {
        return $this->permission;
    }

    /**
     * @param mixed $permission
     */
    public function setPermission($permission)
    {
        $this->permission = $permission;
    }

    /**
     * @return mixed
     */
    public function getWebuserDataId()
    {
        return $this->webuserDataId;
    }

    /**
     * @param mixed $webuserDataId
     */
    public function setWebuserDataId($webuserDataId)
    {
        $this->webuserDataId = $webuserDataId;
    }


}