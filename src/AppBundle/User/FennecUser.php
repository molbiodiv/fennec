<?php

namespace AppBundle\User;

use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthUser;
use Symfony\Component\Security\Core\User\UserInterface;

class FennecUser extends OAuthUser
{
    /**
     * @var string
     */
    protected $username;
    /**
     * @var string
     */
    private $id;
    /**
     * @var string
     */
    private $provider;

    /**
     * User constructor.
     * @param string $id
     * @param string $username
     * @param string $provider
     */
    public function __construct($id, $username, $provider)
    {
        parent::__construct($username);
        $this->id = $id;
        $this->provider = $provider;
    }

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getProvider()
    {
        return $this->provider;
    }

    public function equals(UserInterface $user)
    {
        if(get_class($this) !== get_class($user)){
            return false;
        }
        return $this->id === $user->getId() && $this->username === $user->getUsername() && $this->provider === $user->getProvider();
    }
}