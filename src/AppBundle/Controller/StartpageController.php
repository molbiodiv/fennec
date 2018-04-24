<?php

namespace AppBundle\Controller;

use AppBundle\API\Listing;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class StartpageController extends Controller
{
    /**
     * @Route("/", name="index")
     */
    public function indexAction()
    {
        $default_db = $this->getParameter('default_data_connection');
        return $this->redirectToRoute('startpage', array('dbversion' => $default_db));
    }

    /**
     * @param Request $request
     * @return Response
     * @Route("/startpage", name="startpage")
     */
    public function startpageAction(Request $request){
        $oc = $this->container->get(Listing\Overview::class);
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $overview = $oc->execute();
        $title = "Welcome";
        if($user !== null){
            $title .= " ".$user->getUsername();
        }
        $twig_parameter = array(
            'type' => 'startpage',
            'overview' => $overview,
            'title' => $title,
        );
        return $this->render('startpage/index.html.twig', $twig_parameter);
    }

    /**
     * @return Response
     * @Route("/info", name="fennec_info")
     */
    public function fennecInfoAction(){
        $user = null;
        $title = "About FENNEC";
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        $twig_parameter = array(
            'title' => $title,
            'type' => 'info'
        );
        return $this->render('startpage/info.html.twig', $twig_parameter);
    }
}
