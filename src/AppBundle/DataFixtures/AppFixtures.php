<?php

namespace AppBundle\DataFixtures;

use AppBundle\Entity\Data\Db;
use AppBundle\Entity\Data\TraitFormat;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // create default trait formats
        $categorical_free = new TraitFormat();
        $categorical_free->setFormat('categorical_free');
        $manager->persist($categorical_free);
        $numerical = new TraitFormat();
        $numerical->setFormat('numerical');
        $manager->persist($numerical);

        // create default databases
        $eol_db = new Db();
        $eol_db->setName('EOL');
        $eol_db->setDescription('The Encyclopedia of Life (eol.org)');
        $eol_db->setDate(new \DateTime());
        $manager->persist($eol_db);
        $ncbi_taxonomy = new Db();
        $ncbi_taxonomy->setName('ncbi_taxonomy');
        $ncbi_taxonomy->setDescription('NCBI Taxonomy (https://www.ncbi.nlm.nih.gov/taxonomy)');
        $ncbi_taxonomy->setDate(new \DateTime());
        $manager->persist($ncbi_taxonomy);

        $manager->flush();
    }
}