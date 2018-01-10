<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\API\Listing;
use AppBundle\API\Details;
use AppBundle\API\Delete;
use AppBundle\API\Upload;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends Controller
{
    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/organisms", name="api_listing_organisms", options={"expose"=true})
     */
    public function listingOrganismsAction(Request $request){
        $organisms = $this->container->get(Listing\Organisms::class);
        $response = $this->json($organisms->execute($request->query->get('limit'), "%".$request->query->get('search')."%"));
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/traits", name="api_listing_traits", options={"expose"=true})
     */
    public function listingTraitsAction(Request $request){
        $traits = $this->container->get(Listing\Traits::class);
        $result = $traits->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitEntries/", name="api_details_trait_entries", options={"expose"=true})
     */
    public function detailsTraitEntriesAction(Request $request){
        $traitEntries = $this->container->get(Details\TraitEntries::class);
        $result = $traitEntries->execute($request->query->get('trait_entry_ids'), $request->query->get('trait_format'));
        $response = $this->json($result);
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
