<?php

namespace AppBundle\API;

use AppBundle\ORM;
use AppBundle\Entity\FennecUser;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\ParameterBag;

/** @deprecated */
class Webservice
{
    const ERROR_NOT_LOGGED_IN = "Error. Not logged in.";

    private $ORM;

    public function __construct(ORM $ORM)
    {
        $this->ORM = $ORM;
    }

    /**
     * @param ParameterBag $query
     * @param FennecUser $user
     * @return array result
     * @deprecated
     */
    public function execute(ParameterBag $query, FennecUser $user = null){
        return array();
    }

    /**
     * @param $namespace string
     * @param $classname string
     * @throws Exception
     * @return Webservice
     * @deprecated
     */
    public function factory($namespace, $classname)
    {
        $serviceNamespace = '\\AppBundle\\API\\' . ucfirst($namespace);
        $class = $serviceNamespace . '\\' . ucfirst($classname);
        if (!class_exists($class)) {
            throw new Exception("Could not find class: ".$namespace."\\".$class);
        }

        return new $class($this->ORM);
    }

    /**
     * @param $query ParameterBag
     * @return EntityManager
     * @deprecated
     */
    protected function getManagerFromQuery($query){
        if (! $query->has('dbversion')){
            throw new Exception('No valid dbversion provided');
        }
        return $this->ORM->getManagerForVersion($query->get('dbversion'));
    }
}