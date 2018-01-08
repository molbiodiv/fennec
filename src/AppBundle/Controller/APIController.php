<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends Controller
{
    /**
     * @throws NotFoundHttpException - if the webservice is not found (status code 404)
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/api/{namespace}/{classname}", name="api", options={"expose" = true})
     */
    public function apiAction($namespace, $classname){
        $serviceNamespace = 'AppBundle\\API\\' . ucfirst($namespace);
        $class = $serviceNamespace . '\\' . ucfirst($classname);
        if (!class_exists($class)) {
            throw new Exception("Could not find class: ".$namespace."\\".$class);
        }
        try{
            $service = $this->container->get($class);
        } catch (Exception $e){
            throw $this->createNotFoundException('Webservice not found in the API');
        }
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $result = $service->execute($user);
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

}
