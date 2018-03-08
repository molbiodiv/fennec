<?php

namespace AppBundle\Service;

use \Symfony\Component\HttpKernel\Event\GetResponseEvent;

class DBVersion
{
    private $twig;

    private $defaultConnection;

    private $userConnection;

    private $connectionName;

    /**
     * @return mixed
     */
    public function getConnectionName()
    {
        return $this->connectionName;
    }

    private $orm;


    /**
     * DBVersion constructor.
     */
    public function __construct(
        \Twig_Environment $twig,
        \Doctrine\Bundle\DoctrineBundle\Registry $orm,
        $defaultDataConnection,
        $userConnection
    ) {
        $this->twig = $twig;
        $this->defaultConnection = $defaultDataConnection;
        $this->orm = $orm;
        $this->userConnection = $userConnection;
        $this->connectionName = $defaultDataConnection;
    }

    public function onKernelRequest(GetResponseEvent $event){
        $request = $event->getRequest();
        $params = $request->get('_route_params');
        if(isset($params['dbversion'])){
            $dbversion = $params['dbversion'];
        } else {
            $dbversion = $this->defaultConnection;
        }
        $this->twig->addGlobal('dbversion', $dbversion);
        $this->connectionName = $dbversion;
    }

    public function getDataEntityManager(){
        return $this->orm->getManager($this->connectionName);
    }

    public function getDataEntityManagerForVersion($dbversion){
        return $this->orm->getManager($dbversion);
    }

    public function getUserEntityManager(){
       return $this->orm->getManager($this->userConnection);
    }

    public function overwriteDBVersion($dbversion){
        $this->twig->addGlobal('dbversion', $dbversion);
        $this->connectionName = $dbversion;
    }

    /**
     * @return mixed
     */
    public function getDefaultConnection()
    {
        return $this->defaultConnection;
    }

}