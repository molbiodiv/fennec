<?php

namespace AppBundle\Controller;

use AppBundle\AppBundle;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class APIController extends Controller
{
    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/api/{namespace}/{classname}", name="api", options={"expose" = true})
     */
    public function apiAction(Request $request, $namespace, $classname){
        $service = $this->get('app.api.webservice')->factory($namespace, $classname);
        $result = $service->execute($request->query, $request->getSession());
        return $this->json($result);
    }

}
