<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use AppBundle\API\Details;
use AppBundle\API\Listing;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OrganismController extends Controller
{
    /**
     * @param $request Request
     * @param $dbversion
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/organism/search", name="organism_search")
     */
    public function searchAction(Request $request, $dbversion){
        return $this->render('organism/search.html.twig', ['fennecLayoutType' => 'organism', 'dbversion' => $dbversion, 'title' => 'Organism Search']);
    }

    /**
     * @param $request Request
     * @param $dbversion
     * @return Response
     * @Route("/organism/result", name="organism_result", options={"expose" = true})
     * @Method({"GET"})
     */
    public function resultAction(Request $request, $dbversion){
        $organisms = $this->container->get(Listing\Organisms::class);
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $limit = 50;
        if($query->has('limit')){
            $limit = $query->get('limit');
        }
        $search = "%%";
        if($query->has('search')){
            $search = "%".$query->get('search')."%";
        }
        $result = $organisms->execute($limit, $search);
        return $this->render('organism/result.html.twig', [
            'fennecLayoutType' => 'organism',
            'dbversion' => $dbversion,
            'title' => 'Organism Result',
            'search' => $query->get('search'),
            'organisms' => $result
        ]);
    }

    /**
     * @param $dbversion
     * @param $fennec_id
     * @return Response
     * @Route("/organism/details/{fennec_id}", name="organism_details", options={"expose" = true})
     */
    public function detailsAction($dbversion, $fennec_id){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $organismDetails = $this->container->get(Details\Organisms::class);
        $organismResult = $organismDetails->execute($fennec_id);

        $taxonomy = $this->container->get(Listing\Taxonomy::class);
        $taxonomyResult = $taxonomy->execute($fennec_id);

        $traits = $this->container->get(Details\TraitsOfOrganisms::class);
        $traitResult = $traits->execute(array($fennec_id));
        return $this->render('organism/details.html.twig', [
            'fennecLayoutType' => 'organism',
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
     * @Route("/organism/byTrait/{trait_type_id}", name="organism_by_trait")
     */
    public function byTraitAction(Request $request, $dbversion, $trait_type_id){
        $query = $request->query;
        $organisms = $this->container->get(Details\OrganismsWithTrait::class);
        $limit = 100;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        $fennec_ids = null;
        if ($query->has('fennec_ids') and is_array($query->get('fennec_ids'))){
            $fennec_ids = $query->get('fennec_ids');
        }
        $include_citations = false;
        if ($query->has('include_citations')){
            $include_citations = $query->get('include_citations');
        }
        $organismResult = $organisms->execute($trait_type_id, $limit);
        $trait = $this->container->get(Details\Traits::class);
        $traitResult = $trait->execute($trait_type_id, $fennec_ids, $include_citations);
        return $this->render('organism/byTrait.html.twig', [
            'fennecLayoutType' => 'organism',
            'dbversion' => $dbversion,
            'title' => 'Organisms with Trait',
            'trait' => $traitResult,
            'organisms' => $organismResult
        ]);
    }
}