<?php

namespace AppBundle\Entity\Data;

use Doctrine\ORM\Mapping as ORM;

/**
 * Rank
 *
 * @ORM\Table(name="rank", uniqueConstraints={@ORM\UniqueConstraint(name="rank_name_uniq", columns={"name"})})
 * @ORM\Entity
 */
class Rank
{
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", nullable=false)
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="rank_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="rank_rank_id_seq", allocationSize=1, initialValue=1)
     */
    private $rankId;



    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Rank
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get rankId.
     *
     * @return int
     */
    public function getRankId()
    {
        return $this->rankId;
    }
}
