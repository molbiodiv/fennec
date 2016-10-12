<?php

namespace AppBundle\API;

use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBag;

class Webservice
{
    private $DB;

    public function __construct(\AppBundle\DB $DB)
    {
        $this->DB = $DB;
    }

    /**
     * @param $query ParameterBag
     * @return \PDO db connection
     */
    protected function getDbFromQuery($query){
        if (! $query->has('dbversion')){
            throw new Exception('No valid dbversion provided');
        }
        return $this->DB->getDbForVersion($query->get('dbversion'));
    }
}