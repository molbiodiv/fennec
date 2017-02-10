<?php

namespace AppBundle\API;

use AppBundle\User\FennecUser;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class Webservice
{
    const ERROR_NOT_LOGGED_IN = "Error. Not logged in.";

    private $DB;

    public function __construct(\AppBundle\DB $DB)
    {
        $this->DB = $DB;
    }

    /**
     * @param ParameterBag $query
     * @param FennecUser $user
     * @return array result
     */
    public function execute(ParameterBag $query, FennecUser $user = null){
        return array();
    }

    /**
     * @param $namespace string
     * @param $classname string
     * @throws Exception
     * @return Webservice
     */
    public function factory($namespace, $classname)
    {
        $serviceNamespace = '\\AppBundle\\API\\' . ucfirst($namespace);
        $class = $serviceNamespace . '\\' . ucfirst($classname);
        if (!class_exists($class)) {
            throw new Exception("Could not find class: ".$namespace."\\".$class);
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