<?php

namespace AppBundle\User;

use AppBundle\Entity\OauthProvider;
use AppBundle\Entity\Webuser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use FOS\UserBundle\Model\User as BaseUser;

/**
 * @ORM\Entity
 * @ORM\Table(name="fennec_user")
 */
class FennecUser extends BaseUser
{
    /**
     * @var string
     */
    protected $username;
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    protected $id;
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

    /**
     * @param UserInterface $user
     * @return bool
     */
    public function equals(UserInterface $user)
    {
        if(get_class($this) !== get_class($user)){
            return false;
        }
        return $this->id === $user->getId() && $this->username === $user->getUsername() && $this->provider === $user->getProvider();
    }

    /**
     * @param $em EntityManager
     * @param $create boolean
     * @return Webuser|null
     */
    public function getWebuser($em, $create = false){
        $webuser= null;
        if($em !== null){
            $provider = $em->getRepository('AppBundle:OauthProvider')->findOneBy(array('provider' => $this->getProvider()));
            if($provider === null && $create){
                $provider = new OauthProvider();
                $provider->setProvider($this->getProvider());
                $em->persist($provider);
            }
            if($provider !== null){
                $webuser = $em->getRepository('AppBundle:Webuser')->findOneBy(array('oauthProvider' => $provider, 'oauthId' => $this->getId()));
                if($webuser === null && $create){
                    $webuser = new Webuser();
                    $webuser->setOauthProvider($provider);
                    $webuser->setOauthId($this->getId());
                    $em->persist($webuser);
                    $em->flush();
                }
            }
        }
        return $webuser;
    }
}