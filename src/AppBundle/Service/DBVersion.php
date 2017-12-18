<?php

namespace AppBundle\Service\TwigProvider;

use \Symfony\Component\HttpKernel\Event\GetResponseEvent;

class DBVersion
{
    private $twig;

    private $defaultConnection;


    /**
     * DBVersion constructor.
     */
    public function __construct(\Twig_Environment $twig, $defaultConnection)
    {
        $this->twig = $twig;
        $this->defaultConnection = $defaultConnection;
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
    }

}