<?php

namespace AppBundle\Service;

use \Symfony\Component\HttpKernel\Event\GetResponseEvent;

class DBVersion
{
    private $twig;

    private $defaultConnection;

    private $connectionName;

    private $orm;


    /**
     * DBVersion constructor.
     */
    public function __construct(
        \Twig_Environment $twig,
        \Doctrine\Bundle\DoctrineBundle\Registry $orm,
        $defaultConnection
    ) {
        $this->twig = $twig;
        $this->defaultConnection = $defaultConnection;
        $this->orm = $orm;
    }

    public function onKernelRequest(GetResponseEvent $event){
        $request = $event->getRequest();
        $params = $request->get('_route_params');
        if(isset($params['dbversion'])){
            $dbversion = $params['dbversion'];
        } else {
            $default_db = $this->defaultConnection;
            $dbversion = $default_db;
        }
        $this->twig->addGlobal('dbversion', $dbversion);
        $this->connectionName = $dbversion;
    }

    public function getEntityManager(){
        return $this->orm->getManager($this->connectionName);
    }

}