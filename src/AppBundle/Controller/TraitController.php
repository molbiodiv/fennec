<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use AppBundle\API\Listing;
use AppBundle\API\Details;

class TraitController extends Controller
{
    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/trait/search", name="trait_search")
     */
    public function searchAction(Request $request, $dbversion){
        return $this->render('trait/search.html.twig', ['type' => 'trait', 'dbversion' => $dbversion, 'title' => 'Trait Search']);
    }

    /**
     * @Route("/trait/overview", name="trait_overview")
     */
    public function overviewAction(Request $request, $dbversion){
        $query = $request->query;
        $limit = 1000;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        $search = "%%";
        if ($query->has('search')) {
            $search = "%".$query->get('search')."%";
        }
        $traitsListing = $this->container->get(Listing\Traits::class);
        $traits = $traitsListing->execute($limit, $search);
        return $this->render(
            'trait/overview.html.twig',
            [
                'type' => 'trait',
                'dbversion' => $dbversion,
                'title' => 'Trait Overview',
                'traits' => $traits
            ]
        );
    }

    /**
     * @Route("/trait/result", name="trait_result", options={"expose" = true})
     */
    public function resultAction(Request $request, $dbversion){
        $traitsListing = $this->get('app.api.webservice')->factory('listing', 'traits');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $traits = $traitsListing->execute($query, null);
        return $this->render(
            'trait/result.html.twig',
            [
                'type' => 'trait',
                'dbversion' => $dbversion,
                'title' => 'Trait Overview',
                'search' => $query->get('search'),
                'traits' => $traits
            ]
        );
    }

    /**
     * @param $trait_type_id
     * @param $dbversion
     * @return Response
     * @Route("/trait/details/{trait_type_id}", name="trait_details", options={"expose" = true})
     */
    public function detailsAction($trait_type_id, $dbversion){
        $traitsDetails = $this->container->get(Details\Traits::class);
        $fennec_ids = null;
        $include_citations = array();
        $trait = $traitsDetails->execute($trait_type_id, $fennec_ids, $include_citations);
        if($trait['format'] === 'categorical_free'){
            array_walk($trait['values'], function(&$val, $key) { $val = count($val); });
        }
        return $this->render('trait/details.html.twig', [
            'type' => 'trait',
            'dbversion' => $dbversion,
            'title' => 'Trait Details',
            'trait' => $trait
        ]);
    }

    /**
     * @param Request $request
     * @param $dbversion
     * @param $search_level
     * @return Response
     * @Route("/trait/browse/{search_level}", name="trait_browse", options={"expose" = true})
     */
    public function browseAction(Request $request, $dbversion, $search_level){
        return $this->render('trait/browse.html.twig', [
            'type' => 'trait',
            'dbversion' => $dbversion,
            'title' => 'Trait Browse',
            'searchLevel' => $search_level
        ]);
    }
}