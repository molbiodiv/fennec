<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DBVersionDropdownMenuController extends Controller
{
    public function indexAction(Request $request)
    {
        $params = $request->get('_route_params');
        if(count($params) != 0){
            $dbversion = $params['dbversion'];
        } else {
            $default_db = $this->getParameter('dbal')['default_connection'];
            $dbversion = $default_db;
        }
        return $this->render('components/dbversionDropdownMenu.html.twig', array('dbversion' => $dbversion));
    }
}
