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

    /**
     * @param $request Request
     * @param $dbversion string
     * @param $project_id string
     * @return Response
     * @Route("/{dbversion}/project/details/{project_id}", name="project_details")
     */
    public function detailsAction(Request $request, $dbversion, $project_id){
        $projectDetails = $this->get('app.api.webservice')->factory('details', 'projects');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('ids', array($project_id));
        $projectResult = $projectDetails->execute($query, $request->getSession());
        return $this->render(
            'project/details.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Projects',
                'project' => $projectResult
            ]
        );
    }
}