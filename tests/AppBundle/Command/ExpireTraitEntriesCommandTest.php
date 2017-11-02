<?php

namespace Tests\AppBundle\Command;


use AppBundle\Entity\TraitCategoricalEntry;
use AppBundle\Entity\TraitCategoricalValue;
use AppBundle\Entity\TraitNumericalEntry;
use AppBundle\Entity\TraitType;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Validator\Constraints\DateTime;

class ExpireTraitEntriesCommandTest extends KernelTestCase
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var CommandTester
     */
    private $commandTester;
    /**
     * @var Command
     */
    private $command;

    public function setUp(){
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new ExpireTraitEntriesCommand());

        $this->command = $application->find('app:expire-trait-entries');
        $this->commandTester = new CommandTester($this->command);
        $this->em = self::$kernel->getContainer()->get('app.orm')->getManagerForVersion('test');
    }

    public function testExecute()
    {
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'traittype' => 'expire-test'
        ));
        // the output of the command in the console
        $output = $this->commandTester->getDisplay();
        $this->assertContains('Expire', $output);
    }

    public function testExpireCategoricalTraitType(){
        # Plan: Add two categorical entries + value, expire traitType, assert expiry
        # Add two categorical entries + values
        $ttype = new TraitType();
        $ttype->setType('expireCategoricalTrait');
        $ttype->setTraitFormat($this->em->getRepository('AppBundle:TraitFormat')->findOneBy(array('format' => 'categorical_free')));
        $this->em->persist($ttype);
        $value1 = new TraitCategoricalValue();
        $value1->setValue('value1');
        $value1->setTraitType($ttype);
        $this->em->persist($value1);
        $entry1 = new TraitCategoricalEntry();
        $entry1->setTraitType($ttype);
        $entry1->setFennec(725);
        $entry1->setTraitCategoricalValue($value1);
        $entry1->setWebuser(1);
        $this->em->persist($entry1);
        $value2 = new TraitCategoricalValue();
        $value2->setValue('value2');
        $value2->setTraitType($ttype);
        $this->em->persist($value2);
        $entry2 = new TraitCategoricalEntry();
        $entry2->setTraitType($ttype);
        $entry2->setFennec(213);
        $entry2->setTraitCategoricalValue($value2);
        $entry2->setWebuser(1);
        $this->em->persist($entry2);
        $this->em->flush();
        $entries = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitType' => 'expireCategoricalTrait'
        ));
        foreach($entries as $entry){
            $this->assertNull($entry->getDeletionDate(), 'Before expiry the deletion dates are null');
        }

        # Expire traitType
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--traittype' => 'expireCategoricalTrait'
        ));

        $entries = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitType' => 'expireCategoricalTrait'
        ));
        foreach($entries as $entry){
            $this->assertNotNull($entry->getDeletionDate(), 'After expiry the deletion dates are not null');
        }
    }

    public function testExpireNumericalTraitType(){
        # Plan: Add two numerical values, expire traitType, assert expiry
        # Add two numerical entries
        $ttype = new TraitType();
        $ttype->setType('expireNumericalTrait');
        $ttype->setTraitFormat($this->em->getRepository('AppBundle:TraitFormat')->findOneBy(array('format' => 'numerical')));
        $this->em->persist($ttype);
        $entry1 = new TraitNumericalEntry();
        $entry1->setTraitType($ttype);
        $entry1->setFennec(725);
        $entry1->setValue(13);
        $entry1->setWebuser(1);
        $this->em->persist($entry1);
        $entry2 = new TraitNumericalEntry();
        $entry2->setTraitType($ttype);
        $entry2->setFennec(213);
        $entry2->setTraitCategoricalValue(36429);
        $entry2->setWebuser(1);
        $this->em->persist($entry2);
        $this->em->flush();
        $entries = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findBy(array(
            'traitType' => 'expireNumericalTrait'
        ));
        foreach($entries as $entry){
            $this->assertNull($entry->getDeletionDate(), 'Before expiry the deletion dates are null');
        }

        # Expire traitType
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--traittype' => 'expireNumericalTrait'
        ));

        $entries = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findBy(array(
            'traitType' => 'expireNumericalTrait'
        ));
        foreach($entries as $entry){
            $this->assertNotNull($entry->getDeletionDate(), 'After expiry the deletion dates are not null');
        }
    }

    # preserve deletion date if already deleted
    public function testPreserveDeletionDate(){
        # Plan: Add two numerical values (one already expired), expire traitType, assert expiry of both but unchanged time of first
        # Add two numerical entries
        $ttype = new TraitType();
        $ttype->setType('preserveDeletionDate');
        $ttype->setTraitFormat($this->em->getRepository('AppBundle:TraitFormat')->findOneBy(array('format' => 'numerical')));
        $this->em->persist($ttype);
        $entry1 = new TraitNumericalEntry();
        $entry1->setTraitType($ttype);
        $entry1->setFennec(8);
        $entry1->setValue(0);
        $entry1->setWebuser(1);
        $originalTime = new DateTime();
        $entry1->setDeletionDate($originalTime);
        $this->em->persist($entry1);
        $entry2 = new TraitNumericalEntry();
        $entry2->setTraitType($ttype);
        $entry2->setFennec(213);
        $entry2->setTraitCategoricalValue(36429);
        $entry2->setWebuser(1);
        $this->em->persist($entry2);
        $this->em->flush();
        $alreadyDeletedEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => 'preserveDeletionDate',
            'fennec' => 8
        ));
        $this->assertEquals($originalTime, $alreadyDeletedEntry->getDeletionDate(), 'Before expiry the deletion dates is already set');
        $previouslyNotDeletedEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => 'preserveDeletionDate',
            'fennec' => 213
        ));
        $this->assertNull($previouslyNotDeletedEntry->getDeletionDate(), 'Before expiry the deletion date is null');


        # Expire traitType
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--traittype' => 'preserveDeletionDate'
        ));

        $alreadyDeletedEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => 'preserveDeletionDate',
            'fennec' => 8
        ));
        $this->assertEquals($originalTime, $alreadyDeletedEntry->getDeletionDate(), 'After expiry the deletion date is unchanged');
        $previouslyNotDeletedEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => 'preserveDeletionDate',
            'fennec' => 213
        ));
        $this->assertNotNull($previouslyNotDeletedEntry->getDeletionDate(), 'After expiry the deletion date is set');
        $this->assertNotEquals($originalTime, $previouslyNotDeletedEntry->getDeletionDate(), 'After expiry the deletion date is not the same as that of the manually set one');
    }
}