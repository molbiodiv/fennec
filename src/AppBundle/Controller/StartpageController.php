<?php

namespace AppBundle\Controller;

use AppBundle\Controller\API\Listing\OverviewController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class StartpageController extends Controller
{
    /**
     * @Route("/", name="startpage")
     */
    public function indexAction(Request $request)
    {
        $oc = $this->get('app.api.listing.overview');
        $overview = $oc->execute('1.0', $request->getSession());

        return $this->render('startpage/index.html.twig', ['type' => 'startpage', 'overview' => $overview, 'title' => 'Welcome']);
    }
}
