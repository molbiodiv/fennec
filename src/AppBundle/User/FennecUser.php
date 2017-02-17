<?php

namespace AppBundle\User;

use AppBundle\Entity\Webuser;
use Doctrine\ORM\EntityManager;
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

    /**
     * @param $em EntityManager
     * @return Webuser|null
     */
    public function getWebuser($em){
        $webuser= null;
        if($em !== null){
            $provider = $em->getRepository('AppBundle:OauthProvider')->findOneBy(array('provider' => $this->getProvider()));
            if($provider !== null){
                $webuser = $em->getRepository('AppBundle:Webuser')->findOneBy(array('oauthProvider' => $provider, 'oauthId' => $this->getId()));
            }
        }
        return $webuser;
    }
}