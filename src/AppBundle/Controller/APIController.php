<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\API\Listing;
use AppBundle\API\Details;
use AppBundle\API\Delete;
use AppBundle\API\Upload;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends Controller
{
    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/organisms", name="api_listing_organisms", options={"expose"=true})
     */
    public function listingOrganismsAction(Request $request){
        $organisms = $this->container->get(Listing\Organisms::class);
        $response = $this->json($organisms->execute($request->query->get('limit'), "%".$request->query->get('search')."%"));
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/traits", name="api_listing_traits", options={"expose"=true})
     */
    public function listingTraitsAction(Request $request){
        $traits = $this->container->get(Listing\Traits::class);
        $result = $traits->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitEntries/", name="api_details_trait_entries", options={"expose"=true})
     */
    public function detailsTraitEntriesAction(Request $request){
        $traitEntries = $this->container->get(Details\TraitEntries::class);
        $result = $traitEntries->execute($request->query->get('trait_entry_ids'), $request->query->get('trait_format'));
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/projects/", name="api_listing_projects", options={"expose"=true})
     */
    public function listingProjectsAction(Request $request){
        $projects = $this->container->get(Listing\Projects::class);
        $user = $this->getFennecUser();
        $result = $projects->execute($user);
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/delete/projects/", name="api_delete_projects", options={"expose"=true})
     */
    public function deleteProjectsAction(Request $request){
        $projectId = $request->query->get('projectId');
        $deleteProjects = $this->container->get(Delete\Projects::class);
        $user = $this->getFennecUser();
        $result = $deleteProjects->execute($user, $projectId);
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
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
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitsOfOrganisms/", name="api_details_traits_of_organisms", options={"expose"=true})
     */
    public function detailsTraitsOfOrganismsAction(Request $request){
        $traitDetails = $this->container->get(Details\TraitsOfOrganisms::class);
        $result = $traitDetails->execute($request->query->get('fennecIds'));
        $response = $this->json($result);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
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

    private function getFennecUser(){
        $user = null;
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
            $user = $this->get('security.token_storage')->getToken()->getUser();
        }
        return $user;
    }
}
