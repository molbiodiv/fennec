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

class OrganismController extends Controller
{
    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/{dbversion}/organism/search", name="organism_search")
     */
    public function searchAction(Request $request, $dbversion){
        return $this->render('organism/search.html.twig', ['type' => 'organism', 'dbversion' => $dbversion, 'title' => 'Organism Search']);
    }

    /**
     * @param $request Request
     * @param $dbversion
     * @return Response
     * @Route("/{dbversion}/organism/result", name="organism_result", options={"expose" = true})
     * @Method({"GET"})
     */
    public function resultAction(Request $request, $dbversion){
        $organisms = $this->get('app.api.webservice')->factory('listing', 'organisms');
        $request->query->set('dbversion', $dbversion);
        $result = $organisms->execute($request->query, null);
        return $this->render('organism/result.html.twig', [
            'type' => 'organism',
            'dbversion' => $dbversion,
            'title' => 'Organism Result',
            'organisms' => $result
        ]);
    }

    /**
     * @param Request $request
     * @param $dbversion
     * @param $organism_id
     * @return Response
     * @Route("/{dbversion}/organism/details/{organism_id}", name="organism_details", options={"expose" = true})
     */
    public function detailsAction(Request $request, $dbversion, $organism_id){
        $organismDetails = $this->get('app.api.webservice')->factory('details', 'organism');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('id', $organism_id);
        $organismResult = $organismDetails->execute($query, $request->getSession());
        $taxonomy = $this->get('app.api.webservice')->factory('listing', 'taxonomy');
        $taxonomyResult = $taxonomy->execute($query, null);
        $traits = $this->get('app.api.webservice')->factory('details', 'traitsOfOrganisms');
        $traitResult = $traits->execute(new ParameterBag(array(
            'dbversion' => $dbversion,
            'organism_ids' => array($organism_id)
        )), null);
        return $this->render('organism/details.html.twig', [
            'type' => 'organism',
            'dbversion' => $dbversion,
            'organism' => $organismResult,
            'taxonomy' => $taxonomyResult,
            'traits' => $traitResult
        ]);
    }
}