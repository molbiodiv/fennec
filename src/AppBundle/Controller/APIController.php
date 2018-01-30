<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\API\Listing;
use AppBundle\API\Details;
use AppBundle\API\Delete;
use AppBundle\API\Upload;
use AppBundle\API\Mapping;
use AppBundle\API\Edit;
use AppBundle\API\Sharing;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Email as EmailConstraint;

class APIController extends Controller
{
    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/organisms/", name="api_listing_organisms", options={"expose"=true})
     */
    public function listingOrganismsAction(Request $request){
        $organisms = $this->container->get(Listing\Organisms::class);
        $result = $organisms->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/traits", name="api_listing_traits", options={"expose"=true})
     */
    public function listingTraitsAction(Request $request){
        $traits = $this->container->get(Listing\Traits::class);
        $result = $traits->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitEntries/", name="api_details_trait_entries", options={"expose"=true})
     */
    public function detailsTraitEntriesAction(Request $request){
        $traitEntries = $this->container->get(Details\TraitEntries::class);
        $result = $traitEntries->execute($request->query->get('trait_entry_ids'), $request->query->get('trait_format'));
        return $this->createResponse($result);
    }

    /**
     * @return Response $response
     * @Route("/api/listing/projects/", name="api_listing_projects", options={"expose"=true})
     */
    public function listingProjectsAction(){
        $projects = $this->container->get(Listing\Projects::class);
        $user = $this->getFennecUser();
        $result = $projects->execute($user);
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/delete/projects/", name="api_delete_projects", options={"expose"=true})
     */
    public function deleteProjectsAction(Request $request){
        $projectId = $request->query->get('projectId');
        $permission = $request->query->get('attribute');
        $deleteProjects = $this->container->get(Delete\Projects::class);
        $user = $this->getFennecUser();
        $result = $deleteProjects->execute($user, $projectId, $permission);
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/upload/projects/", name="api_upload_projects", options={"expose"=true})
     */
    public function uploadProjectsAction(Request $request){
        $uploadProjects = $this->container->get(Upload\Projects::class);
        $user = $this->getFennecUser();
        $result = $uploadProjects->execute($user);
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitsOfOrganisms/", name="api_details_traits_of_organisms", options={"expose"=true})
     */
    public function detailsTraitsOfOrganismsAction(Request $request){
        $traitDetails = $this->container->get(Details\TraitsOfOrganisms::class);
        $result = $traitDetails->execute($request->request->get('fennecIds'));
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitOfProject/", name="api_details_trait_of_project", options={"expose"=true})
     */
    public function detailsTraitOfProjectAction(Request $request){
        $traitDetails = $this->container->get(Details\TraitOfProject::class);
        $result = $traitDetails->execute($request->query->get('fennecIds'));
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/edit/updateProject/", name="api_edit_update_project", options={"expose"=true})
     */
    public function editUpdateProjectAction(Request $request){
        $updateProjects = $this->container->get(Edit\UpdateProject::class);
        $user = $this->getFennecUser();
        $result = $updateProjects->execute($request->request->get('projectId'), $request->request->get('biom'), $user);
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/mapping/byDbxrefId/", name="api_mapping_byDbxrefId", options={"expose"=true})
     */
    public function mappingByDbxrefIdAction(Request $request){
        $mapping = $this->container->get(Mapping\ByDbxrefId::class);
        $result = $mapping->execute($request->request->get('ids'), $request->request->get('db'));
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/mapping/byOrganismName/", name="api_mapping_byOrganismName", options={"expose"=true})
     */
    public function mappingByOrganismNameAction(Request $request){
        $mapping = $this->container->get(Mapping\ByOrganismName::class);
        $result = $mapping->execute($request->query->get('ids'));
        return $this->createResponse($result);
    }


    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/scinames/", name="api_listing_scinames", options={"expose"=true})
     */
    public function listingScinamesAction(Request $request){
        $listingScinames = $this->container->get(Listing\Scinames::class);
        $result = $listingScinames->execute($request->query->get('ids'));
        return $this->createResponse($result);
    }

    /**
     * @param Request $request
     * @param $projectId
     * @return Response $response
     * @Security("is_granted('owner', projectId)")
     * @Route("/api/sharing/projects/{projectId}", name="api_sharing_projects", options={"expose"=true})
     */
    public function shareProjectAction($projectId, Request $request){
        $email = $request->query->get('email');
        $emailConstraint = new EmailConstraint();
        $validator = $this->get('validator');
        $errors = $validator->validate($email, $emailConstraint);
        if(count($errors) > 1){
            $this->createResponse($errors);
        }
        $shareProject = $this->container->get(Sharing\Projects::class);
        $result = $shareProject->execute($email, $projectId, $request->query->get('attribute'));
        return $this->createResponse($result);
    }

    private function getFennecUser(){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        return $user;
    }

    private function createResponse($result){
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }
}
