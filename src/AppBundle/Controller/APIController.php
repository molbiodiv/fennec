<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\API\Listing;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends Controller
{
    /**
     * @Route("/api/listing/organisms", name="api_listing_organisms", options={"expose"=true})
     */
    public function listingOrganismsAction(Request $request){
        $organisms = $this->container->get(Listing\Organisms::class);
        $response = $this->json($organisms->execute($request->query->get('limit'), "%".$request->query->get('search')."%"));
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    private function getFennecUser(){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        return $user;
    }
}
