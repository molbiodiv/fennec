<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\User\FennecUserRepository")
 * @ORM\Table(name="`fennec_user`")
 * @ORM\AttributeOverrides({
 *     @ORM\AttributeOverride(name="password",
 *          column=@ORM\Column(
 *              nullable=true
 *          ))
 *     })
 */
class FennecUser extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @return mixed
     */
    public function getGithubAccessToken()
    {
        return $this->github_access_token;
    }

    /**
     * @param mixed $github_access_token
     */
    public function setGithubAccessToken($github_access_token)
    {
        $this->github_access_token = $github_access_token;
    }

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $github_access_token;

    /**
     * @ORM\Column(type="string",nullable=true)
     */
    private $firstName;

    /**
     * @ORM\Column(type="string",nullable=true)
     */
    private $lastName;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\User\Permissions", mappedBy="webuser")
     */
    private $permissions;

    /**
     * @return mixed
     */
    public function getPermissions()
    {
        return $this->permissions;
    }

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
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @param mixed $firstName
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    /**
     * @return mixed
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @param mixed $lastName
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    public function getId()
    {
        return $this->id;
    }
}
