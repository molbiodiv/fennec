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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProjectController extends Controller
{
    /**
     * @param $request Request
     * @param $dbversion string
     * @return Response
     * @Route("/{dbversion}/project/overview", name="project_overview")
     */
    public function overviewAction(Request $request, $dbversion){
        return $this->render(
            'project/overview.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Projects'
            ]
        );
    }
}