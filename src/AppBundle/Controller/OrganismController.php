<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;

class OrganismController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/{dbversion}/organism/search", name="organism_search")
     */
    public function searchAction(Request $request, $dbversion){
        return $this->render('organism/search.html.twig', ['type' => 'organism', 'dbversion' => $dbversion, 'title' => 'Organism Search']);
    }
}