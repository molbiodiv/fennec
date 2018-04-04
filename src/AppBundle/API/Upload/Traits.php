<?php

namespace AppBundle\API\Upload;


use AppBundle\Service\DBVersion;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;
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
        if (!is_uploaded_file($_FILES[0]['tmp_name'])) {
            return array("result"=>null,"error"=>"Error in request!");
        }
        $content = file_get_contents($_FILES[0]['tmp_name']);
        [$return_code, $output] = $this->executeTraitImportCommand($content, $user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $result = array("result" => null, "error" => null);
        if($return_code === 0){
            preg_match_all('/\|.*/',$output,$treffer);
            foreach($treffer[0] as $line){
                [$idontcare, $key, $value] = explode('|', $line);
                $key = trim($key);
                $value = trim($value);
                $result["result"][$key] = $value;
            }
        } else {
            $result["error"] = $output;
        }
        return $result;
    }

    private function executeTraitImportCommand($content, $user, $traitType, $defaultCitation, $mapping, $skipUnmapped)
    {
        $tempDir = tempnam(sys_get_temp_dir(), 'traitUpload');
        unlink($tempDir);
        mkdir($tempDir);
        $tempFile = $tempDir. DIRECTORY_SEPARATOR .$_FILES[0]['name'];
        file_put_contents($tempFile, $content);
        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $input_parameters = array(
            '--fennec-user-id' => $user->getId(),
            '--dbversion' => $this->dbversion,
            '--traittype' => $traitType,
            '--default-citation' => $defaultCitation,
            '--skip-unmapped' => $skipUnmapped,
            '--provider' => 'userImport',
        );
        if($mapping !== null){
            $input_parameters['--mapping'] = $mapping;
        }

        $input = new ArrayInput(array_merge(array(
           'command' => 'app:import-trait-entries',
           'file' => $tempFile
        ),$input_parameters));

        // You can use NullOutput() if you don't need the output
        $output = new BufferedOutput(OutputInterface::VERBOSITY_NORMAL, false);
        $returnCode = $application->run($input, $output);

        // return the output, don't use if you used NullOutput()
        $result = $output->fetch();
        unlink($tempFile);
        rmdir($tempDir);
        return array($returnCode,$result);
    }

}