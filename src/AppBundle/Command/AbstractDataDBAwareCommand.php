<?php

namespace AppBundle\Command;


use AppBundle\Service\DBVersion;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;

abstract class AbstractDataDBAwareCommand extends ContainerAwareCommand
{
    protected function configure(){
        $this->addOption('dbversion', null, InputOption::VALUE_REQUIRED, 'The database version to use (default: default_data_entity_manager from parameters.yml)');
    }

    /**
     * @param InputInterface $input
     * @return EntityManager
     */
    protected function initConnection(InputInterface $input)
    {
        $emVersion = $input->getOption('dbversion');
        if ($emVersion === null) {
            $emVersion = $this->getContainer()->getParameter('default_data_entity_manager');
        }
        return $this->getContainer()->get(DBVersion::class)->getDataEntityManagerForVersion($emVersion);
    }
}