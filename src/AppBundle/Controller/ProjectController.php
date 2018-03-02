<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 12.10.16
 * Time: 09:34
 */

namespace AppBundle\Controller;


use AppBundle\Entity\User\FennecUser;
use AppBundle\API\Details;
use AppBundle\Service\DBVersion;
use phpDocumentor\Reflection\Types\String_;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

class ProjectController extends Controller
{
    /**
     * @param $request Request
     * @param $dbversion string
     * @return Response
     * @Route("/project/overview", name="project_overview")
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
     * @param $dbversion string
     * @param $project_id string
     * @param $attribute string
     * @return Response
     * @Security("is_granted(attribute, project_id)")
     * @Route("/project/details/{project_id}/{attribute}", name="project_details", options={"expose" = true})
     */
    public function detailsAction($dbversion, $project_id, $attribute){
        $projectDetails = $this->container->get(Details\Projects::class);
        $user = $this->getFennecUser();
        $projectResult = $projectDetails->execute($project_id, $user);
        return $this->render(
            'project/details.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Projects',
                'project' => $projectResult,
                'internal_project_id' => $project_id,
                'attribute' => $attribute
            ]
        );
    }

    /**
     * @param $dbversion string
     * @param $project_id string
     * @param $attribute string
     * @param $trait_type_id
     * @param $dimension
     * @Security("is_granted(attribute, project_id)")
     * @return Response
     * @Route(
     *     "/project/details/{project_id}/{attribute}/trait/{trait_type_id}/{dimension}",
     *     name="project_trait_details",
     *     options={"expose" = true},
     *     requirements={"dimension": "rows|columns"}
     * )
     */
    public function traitDetailsAction($attribute, $dbversion, $project_id, $trait_type_id, $dimension){
        $projectTraitDetails = $this->container->get(Details\TraitOfProject::class);
        $includeCitations = true;
        $user = $this->getFennecUser();
        $traitResult = $projectTraitDetails->execute($trait_type_id, $project_id, $dimension, $user, $dbversion, $includeCitations);
        $projectDetails = $this->container->get(Details\Projects::class);
        $projectResult = $projectDetails->execute($project_id, $user);
        return $this->render(
            'project/traitDetails.html.twig',
            [
                'dbversion' => $dbversion,
                'type' => 'project',
                'title' => 'Trait of Project',
                'trait' => $traitResult,
                'project' => $projectResult,
                'internal_project_id' => $project_id,
                'dimension' => $dimension,
                'attribute' => $attribute
            ]
        );
    }

    /**
     * @return FennecUser|null
     */
    private function getFennecUser(){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_REMEMBERED')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        return $user;

    }
}