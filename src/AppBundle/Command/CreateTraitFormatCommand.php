<?php

namespace AppBundle\Command;


use AppBundle\Entity\Data\TraitFormat;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateTraitFormatCommand extends AbstractDataDBAwareCommand
{
    protected function configure()
    {
        parent::configure();
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:create-traitformat')

        // the short description shown while running "php bin/console list"
        ->setDescription('Creates new TraitFormat.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to create trait types...")
        ->addArgument('format', InputArgument::REQUIRED, 'The name of the new trait format')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'TraitFormat Creator',
            '===================',
            '',
        ]);
        $em = $this->initConnection($input);
        $format = $em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => $input->getArgument('format')]);
        if($format != null){
            $output->writeln('<info>TraitFormat already exists, nothing to do.</info>');
            $output->writeln('<info>TraitFormat ID is: '.$format->getId().'</info>');
            return;
        }
        $traitFormat = new TraitFormat();
        $traitFormat->setFormat($input->getArgument('format'));
        $em->persist($traitFormat);
        $em->flush();
        $output->writeln('<info>TraitFormat successfully created: '.$traitFormat->getFormat().'</info>');
        $output->writeln('<info>TraitFormat ID is: '.$traitFormat->getId().'</info>');
    }
}