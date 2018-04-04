<?php

namespace AppBundle\API\Upload;


use AppBundle\Service\DBVersion;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpKernel\KernelInterface;

class Traits
{
    private $dbversion;
    private $kernel;

    /**
     * Traits constructor.
     * @param $dbversion
     * @param KernelInterface $kernel
     */
    public function __construct(DBVersion $dbversion, KernelInterface $kernel)
    {
        $this->dbversion = $dbversion->getConnectionName();
        $this->kernel = $kernel;
    }


    public function execute($user, $traitType, $defaultCitation, $mapping, $skipUnmapped){
        $content = file_get_contents($_FILES[0]['tmp_name']);
        $result = $this->executeTraitImportCommand($content, $user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        return $result;
    }

    private function executeTraitImportCommand($content, $user, $traitType, $defaultCitation, $mapping, $skipUnmapped)
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'traitUpload');
        file_put_contents($tempFile, $content);
        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput(array(
           'command' => 'app:import-trait-entries',
           // (optional) define the value of command arguments
           'file' => $tempFile,
           // (optional) pass options to the command
           '--fennec-user-id' => $user->getId(),
            '--dbversion' => $this->dbversion,
            '--traittype' => $traitType,
            '--default-citation' => $defaultCitation,
            '--mapping' => $mapping,
            '--skip-unmapped' => $skipUnmapped,
            '--provider' => 'userImport'
        ));

        // You can use NullOutput() if you don't need the output
        $output = new BufferedOutput();
        $application->run($input, $output);

        // return the output, don't use if you used NullOutput()
        $result = $output->fetch();
        var_dump($result);
        unlink($tempFile);
        return $result;
    }

}