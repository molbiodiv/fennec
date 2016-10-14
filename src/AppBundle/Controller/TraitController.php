<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class TraitController extends Controller
{
    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/{dbversion}/trait/search", name="trait_search")
     */
    public function searchAction(Request $request, $dbversion){
        return $this->render('trait/search.html.twig', ['type' => 'trait', 'dbversion' => $dbversion, 'title' => 'Trait Search']);
    }

    /**
     * @Route("/{dbversion}/trait/overview", name="trait_overview")
     */
    public function overviewAction(Request $request, $dbversion){
        $traitsListing = $this->get('app.api.webservice')->factory('listing', 'traits');
        $query = new ParameterBag(array(
            'search' => '',
            'limit' => 6,
            'dbversion' => $dbversion
        ));
        $traits = $traitsListing->execute($query, null);
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
     * @param Request $request
     * @param $dbversion
     * @param $trait_id
     * @return Response
     * @Route("/{dbversion}/trait/details/{trait_type_id}", name="trait_details", options={"expose" = true})
     */
    public function detailsAction(Request $request, $dbversion, $trait_type_id){

    }
}