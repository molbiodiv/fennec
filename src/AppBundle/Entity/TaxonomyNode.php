<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TaxonomyNode
 *
 * @ORM\Table(name="taxonomy_node", indexes={@ORM\Index(name="IDX_E79D6AF2A2BF053A", columns={"db_id"}), @ORM\Index(name="IDX_E79D6AF2594DA73F", columns={"fennec_id"}), @ORM\Index(name="IDX_E79D6AF27616678F", columns={"rank_id"})})
 * @ORM\Entity
 */
class TaxonomyNode
{
    /**
     * @var int|null
     *
     * @ORM\Column(name="parent_taxonomy_node_id", type="integer", nullable=true)
     */
    private $parentTaxonomyNodeId;

    /**
     * @var int
     *
     * @ORM\Column(name="left_idx", type="integer", nullable=false)
     */
    private $leftIdx;

    /**
     * @var int
     *
     * @ORM\Column(name="right_idx", type="integer", nullable=false)
     */
    private $rightIdx;

    /**
     * @var int
     *
     * @ORM\Column(name="taxonomy_node_id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="taxonomy_node_taxonomy_node_id_seq", allocationSize=1, initialValue=1)
     */
    private $taxonomyNodeId;

    /**
     * @var \AppBundle\Entity\Db
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Db")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="db_id", referencedColumnName="db_id", nullable=false)
     * })
     */
    private $db;

    /**
     * @var \AppBundle\Entity\Organism
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Organism")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="fennec_id", referencedColumnName="fennec_id", nullable=false)
     * })
     */
    private $fennec;

    /**
     * @var \AppBundle\Entity\Rank
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Rank")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="rank_id", referencedColumnName="rank_id")
     * })
     */
    private $rank;



    /**
     * Set parentTaxonomyNodeId.
     *
     * @param int|null $parentTaxonomyNodeId
     *
     * @return TaxonomyNode
     */
    public function setParentTaxonomyNodeId($parentTaxonomyNodeId = null)
    {
        $this->parentTaxonomyNodeId = $parentTaxonomyNodeId;

        return $this;
    }

    /**
     * Get parentTaxonomyNodeId.
     *
     * @return int|null
     */
    public function getParentTaxonomyNodeId()
    {
        return $this->parentTaxonomyNodeId;
    }

    /**
     * Set leftIdx.
     *
     * @param int $leftIdx
     *
     * @return TaxonomyNode
     */
    public function setLeftIdx($leftIdx)
    {
        $this->leftIdx = $leftIdx;

        return $this;
    }

    /**
     * Get leftIdx.
     *
     * @return int
     */
    public function getLeftIdx()
    {
        return $this->leftIdx;
    }

    /**
     * Set rightIdx.
     *
     * @param int $rightIdx
     *
     * @return TaxonomyNode
     */
    public function setRightIdx($rightIdx)
    {
        $this->rightIdx = $rightIdx;

        return $this;
    }

    /**
     * Get rightIdx.
     *
     * @return int
     */
    public function getRightIdx()
    {
        return $this->rightIdx;
    }

    /**
     * Get taxonomyNodeId.
     *
     * @return int
     */
    public function getTaxonomyNodeId()
    {
        return $this->taxonomyNodeId;
    }

    /**
     * Set db.
     *
     * @param \AppBundle\Entity\Db|null $db
     *
     * @return TaxonomyNode
     */
    public function setDb(\AppBundle\Entity\Db $db = null)
    {
        $this->db = $db;

        return $this;
    }

    /**
     * Get db.
     *
     * @return \AppBundle\Entity\Db|null
     */
    public function getDb()
    {
        return $this->db;
    }

    /**
     * Set fennec.
     *
     * @param \AppBundle\Entity\Organism|null $fennec
     *
     * @return TaxonomyNode
     */
    public function setFennec(\AppBundle\Entity\Organism $fennec = null)
    {
        $this->fennec = $fennec;

        return $this;
    }

    /**
     * Get fennec.
     *
     * @return \AppBundle\Entity\Organism|null
     */
    public function getFennec()
    {
        return $this->fennec;
    }

    /**
     * Set rank.
     *
     * @param \AppBundle\Entity\Rank|null $rank
     *
     * @return TaxonomyNode
     */
    public function setRank(\AppBundle\Entity\Rank $rank = null)
    {
        $this->rank = $rank;

        return $this;
    }

    /**
     * Get rank.
     *
     * @return \AppBundle\Entity\Rank|null
     */
    public function getRank()
    {
        return $this->rank;
    }
}
