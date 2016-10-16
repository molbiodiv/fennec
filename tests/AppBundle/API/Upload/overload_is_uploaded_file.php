<?php

namespace AppBundle\API\Upload;

/**
 * Override is_uploaded_file() in fennecweb\ajax\upload namespace for testing
 * Rather than checking wether the file was uploaded via POST it is just checked wether the file exists
 * @param String $filename file to check for existence
 * @return boolean indicating wether the requested file exists
 */
function is_uploaded_file($filename)
{
    return file_exists($filename);
}
