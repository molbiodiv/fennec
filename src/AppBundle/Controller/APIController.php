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
     * @param $request Request
     * @throws NotFoundHttpException - if the webservice is not found (status code 404)
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/api/{namespace}/{classname}", name="api", options={"expose" = true})
     */
    public function apiAction(Request $request, $namespace, $classname){
        try{
            $service = $this->get('app.api.webservice')->factory($namespace, $classname);
        } catch (Exception $e){
            throw $this->createNotFoundException('Webservice not found in the API');
        }
        $queryData = new ParameterBag(array_merge($request->query->all(), $request->request->all()));
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $result = $service->execute($queryData, $user);
        return $this->json($result);
    }

}
