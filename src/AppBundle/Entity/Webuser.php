<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Webuser
 *
 * @ORM\Table(name="webuser", uniqueConstraints={@ORM\UniqueConstraint(name="oauth_provider_id_oauth_id_uniq", columns={"oauth_provider_id", "oauth_id"})}, indexes={@ORM\Index(name="IDX_A3BF824A56720401", columns={"oauth_provider_id"})})
 * @ORM\Entity
 */
class Webuser
{
    /**
     * @var string
     *
     * @ORM\Column(name="oauth_id", type="text", nullable=false)
     */
    private $oauthId;

    /**
     * @var int
     *
     * @ORM\Column(name="webuser_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="webuser_webuser_id_seq", allocationSize=1, initialValue=1)
     */
    private $webuserId;

    /**
     * @var \AppBundle\Entity\OauthProvider
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\OauthProvider", inversedBy="webUsers")
     * @ORM\JoinColumn(name="oauth_provider_id", referencedColumnName="oauth_provider_id", nullable=false)
     */
    private $oauthProvider;


    /**
     * @var WebuserData
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\WebuserData", mappedBy="webuser")
     */
    private $data;


    /**
     * Set oauthId.
     *
     * @param string $oauthId
     *
     * @return Webuser
     */
    public function setOauthId($oauthId)
    {
        $this->oauthId = $oauthId;

        return $this;
    }

    /**
     * Get oauthId.
     *
     * @return string
     */
    public function getOauthId()
    {
        return $this->oauthId;
    }

    /**
     * Get webuserId.
     *
     * @return int
     */
    public function getWebuserId()
    {
        return $this->webuserId;
    }

    /**
     * Set oauthProvider.
     *
     * @param \AppBundle\Entity\OauthProvider|null $oauthProvider
     *
     * @return Webuser
     */
    public function setOauthProvider(\AppBundle\Entity\OauthProvider $oauthProvider = null)
    {
        $this->oauthProvider = $oauthProvider;

        return $this;
    }

    /**
     * Get oauthProvider.
     *
     * @return \AppBundle\Entity\OauthProvider|null
     */
    public function getOauthProvider()
    {
        return $this->oauthProvider;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->data = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add datum.
     *
     * @param \AppBundle\Entity\WebuserData $datum
     *
     * @return Webuser
     */
    public function addDatum(\AppBundle\Entity\WebuserData $datum)
    {
        $this->data[] = $datum;

        return $this;
    }

    /**
     * Remove datum.
     *
     * @param \AppBundle\Entity\WebuserData $datum
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeDatum(\AppBundle\Entity\WebuserData $datum)
    {
        return $this->data->removeElement($datum);
    }

    /**
     * Get data.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getData()
    {
        return $this->data;
    }
}
