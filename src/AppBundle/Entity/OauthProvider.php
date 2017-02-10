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
}
