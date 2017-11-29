<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 11/29/17
 * Time: 7:46 AM
 */

namespace AppBundle\Service\TwigProvider;

use \Symfony\Component\HttpKernel\Event\GetResponseEvent;


class Types
{
    private $twig;

    /**
     * Types constructor.
     * @param $twig
     */
    public function __construct($twig)
    {
        $this->twig = $twig;
    }

    public function onKernelRequest(GetResponseEvent $event){
        $this->twig->addGlobal('types', 'startpage');
        $this->twig->addGlobal('title', 'Welcome');
    }


}