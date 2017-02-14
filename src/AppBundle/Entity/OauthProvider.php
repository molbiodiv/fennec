<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * OauthProvider
 *
 * @ORM\Table(name="oauth_provider", uniqueConstraints={@ORM\UniqueConstraint(name="provider_uniq", columns={"provider"})})
 * @ORM\Entity
 */
class OauthProvider
{
    /**
     * @var string
     *
     * @ORM\Column(name="provider", type="text", nullable=false)
     */
    private $provider;

    /**
     * @var int
     *
     * @ORM\Column(name="oauth_provider_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="oauth_provider_oauth_provider_id_seq", allocationSize=1, initialValue=1)
     */
    private $oauthProviderId;

    /**
     * @var Webuser
     * @ORM\OneToMany(targetEntity="Webuser", mappedBy="oauthProvider")
     */
    private $webUsers;

    /**
     * Set provider.
     *
     * @param string $provider
     *
     * @return OauthProvider
     */
    public function setProvider($provider)
    {
        $this->provider = $provider;

        return $this;
    }

    /**
     * Get provider.
     *
     * @return string
     */
    public function getProvider()
    {
        return $this->provider;
    }

    /**
     * Get oauthProviderId.
     *
     * @return int
     */
    public function getOauthProviderId()
    {
        return $this->oauthProviderId;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->webUsers = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add webUser.
     *
     * @param \AppBundle\Entity\Webuser $webUser
     *
     * @return OauthProvider
     */
    public function addWebUser(\AppBundle\Entity\Webuser $webUser)
    {
        $this->webUsers[] = $webUser;

        return $this;
    }

    /**
     * Remove webUser.
     *
     * @param \AppBundle\Entity\Webuser $webUser
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeWebUser(\AppBundle\Entity\Webuser $webUser)
    {
        return $this->webUsers->removeElement($webUser);
    }

    /**
     * Get webUsers.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getWebUsers()
    {
        return $this->webUsers;
    }
}
