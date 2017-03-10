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
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $result = $organisms->execute($query, null);
        return $this->render('organism/result.html.twig', [
            'type' => 'organism',
            'dbversion' => $dbversion,
            'title' => 'Organism Result',
            'search' => $query->get('search'),
            'organisms' => $result
        ]);
    }

    /**
     * @param Request $request
     * @param $dbversion
     * @param $fennec_id
     * @return Response
     * @Route("/{dbversion}/organism/details/{fennec_id}", name="organism_details", options={"expose" = true})
     */
    public function detailsAction(Request $request, $dbversion, $fennec_id){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $organismDetails = $this->get('app.api.webservice')->factory('details', 'organism');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('id', $fennec_id);
        $organismResult = $organismDetails->execute($query, $user);
        $taxonomy = $this->get('app.api.webservice')->factory('listing', 'taxonomy');
        $taxonomyResult = $taxonomy->execute($query, null);
        $traits = $this->get('app.api.webservice')->factory('details', 'traitsOfOrganisms');
        $traitResult = $traits->execute(new ParameterBag(array(
            'dbversion' => $dbversion,
            'fennec_ids' => array($fennec_id)
        )), null);
        return $this->render('organism/details.html.twig', [
            'type' => 'organism',
            'dbversion' => $dbversion,
            'organism' => $organismResult,
            'taxonomy' => $taxonomyResult,
            'traits' => $traitResult
        ]);
    }

    /**
     * @param $request Request
     * @param $dbversion
     * @param $trait_type_id
     * @return Response
     * @Route("/{dbversion}/organism/byTrait/{trait_type_id}", name="organism_by_trait")
     */
    public function byTraitAction(Request $request, $dbversion, $trait_type_id){
        $organisms = $this->get('app.api.webservice')->factory('details', 'organismsWithTrait');
        $trait = $this->get('app.api.webservice')->factory('details', 'traits');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('trait_type_id', $trait_type_id);
        $organismResult = $organisms->execute($query, null);
        $traitResult = $trait->execute($query, null);
        return $this->render('organism/byTrait.html.twig', [
            'type' => 'organism',
            'dbversion' => $dbversion,
            'title' => 'Organisms with Trait',
            'trait' => $traitResult,
            'organisms' => $organismResult
        ]);
    }
}