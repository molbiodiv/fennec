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
     * @param $namespace string
     * @param $classname string
     * @return Webservice|null
     */
    public function factory($namespace, $classname)
    {
        $serviceNamespace = '\\AppBundle\\API\\' . ucfirst($namespace);
        $class = $serviceNamespace . '\\' . ucfirst($classname);
        if (!class_exists($class)) {
            return null;
        }

        return new $class($this->DB);
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