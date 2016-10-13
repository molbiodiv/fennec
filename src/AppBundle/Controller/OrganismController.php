<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use Symfony\Component\DependencyInjection\ParameterBag\ParameterBag;
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
     * @Route("/{dbversion}/result/organism", name="organism_result", options={"expose" = true})
     * @Method({"GET"})
     */
    public function organismResultAction(Request $request, $dbversion){
        $organisms = $this->get('app.api.webservice')->factory('listing', 'organisms');
        $request->query->set('dbversion', $dbversion);
        $result = $organisms->execute($request->query, null);
        return $this->render('organism/result.html.twig', ['type' => 'organism', 'dbversion' => $dbversion, 'title' => 'Organism Result', 'organisms' => $result]);
    }
}