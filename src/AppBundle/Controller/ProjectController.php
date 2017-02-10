<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use AppBundle\User\FennecUser;
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
     * @Route("/{dbversion}/project/details/{project_id}", name="project_details", options={"expose" = true})
     */
    public function detailsAction(Request $request, $dbversion, $project_id){
        $projectDetails = $this->get('app.api.webservice')->factory('details', 'projects');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('ids', array($project_id));
        $projectResult = $projectDetails->execute($query, $this->getFennecUser());
        return $this->render(
            'project/details.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Projects',
                'project' => $projectResult,
                'internal_project_id' => $project_id
            ]
        );
    }

    /**
     * @param $request Request
     * @param $dbversion string
     * @param $project_id string
     * @param $trait_type_id
     * @return Response
     * @Route("/{dbversion}/project/details/{project_id}/trait/{trait_type_id}", name="project_trait_details", options={"expose" = true})
     */
    public function traitDetailsAction(Request $request, $dbversion, $project_id, $trait_type_id){
        $projectTraitDetails = $this->get('app.api.webservice')->factory('details', 'traitOfProject');
        $query = $request->query;
        $query->set('dbversion', $dbversion);
        $query->set('internal_project_id', $project_id);
        $query->set('trait_type_id', $trait_type_id);
        $traitResult = $projectTraitDetails->execute($query, $this->getFennecUser());
        $projectDetails = $this->get('app.api.webservice')->factory('details', 'projects');
        $query->set('ids', array($project_id));
        $projectResult = $projectDetails->execute($query, $this->getFennecUser());
        return $this->render(
            'project/traitDetails.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Trait of Project',
                'trait' => $traitResult,
                'project' => $projectResult,
                'internal_project_id' => $project_id
            ]
        );
    }

    /**
     * @return FennecUser|null
     */
    private function getFennecUser(){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        return $user;

    }
}