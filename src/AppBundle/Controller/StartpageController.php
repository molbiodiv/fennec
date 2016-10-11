<?php

namespace AppBundle\Controller;

use AppBundle\Controller\API\Listing\OverviewController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\BrowserKit\Response;
use Symfony\Component\HttpFoundation\Request;

class StartpageController extends Controller
{
    /**
     * @Route("/", name="index")
     */
    public function indexAction(Request $request)
    {
        $default_db = $this->getParameter('default_db');
        return $this->redirectToRoute('startpage', array('dbversion' => $default_db));
    }

    /**
     * @param Request $request
     * @return Response
     * @Route("/{dbversion}/startpage", name="startpage")
     */
    public function startpageAction(Request $request, $dbversion){
        $oc = $this->get('app.api.listing.overview');
        $overview = $oc->execute($dbversion, $request->getSession());
        return $this->render('startpage/index.html.twig', ['type' => 'startpage', 'overview' => $overview, 'title' => 'Welcome', 'dbversion' => $dbversion]);
    }
}
