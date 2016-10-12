<?php

namespace AppBundle\Controller;

use AppBundle\AppBundle;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class APIController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/api/listing/overview", name="listing_overview")
     */
    public function overviewAction(Request $request)
    {
        $overview = $this->get('app.api.listing.overview');
        $db_version = $request->query->get('dbversion');
        $result = $overview->execute($db_version, $request->getSession());
        return $this->json($result);
    }

    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/api/listing/organism", name="organism_listing")
     */
    public function organismListingAction(Request $request){
        $organisms = $this->get('app.api.listing.organisms');
        $result = $organisms->execute($request->query);
        return $this->json($result);
    }

}
