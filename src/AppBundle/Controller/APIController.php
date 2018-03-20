<?php

namespace AppBundle\Controller;

use AppBundle\API\Delete;
use AppBundle\API\Details;
use AppBundle\API\Edit;
use AppBundle\API\Listing;
use AppBundle\API\Mapping;
use AppBundle\API\Sharing;
use AppBundle\API\Upload;
use Nelmio\ApiDocBundle\Annotation\Operation;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Swagger\Annotations as SWG;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class APIController extends Controller
{
    /**
     * Search for organisms by scientific name.
     * You can provide a case-insensitive part of the scientific name or provide a limit.
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns a list of organisms"
     * )
     * @SWG\Parameter(
     *     name="search",
     *     in="query",
     *     type="string",
     *     description="search term, part of the scientific name (case insensitive)"
     * )
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     type="integer",
     *     description="max number of organisms to return"
     * )
     * @SWG\Tag(name="Listing")
     *
     * @param Request $request
     * @return Response
     *
     * @Route("/api/listing/organisms", name="api_listing_organisms", options={"expose"=true}, methods={"GET"})
     */
    public function listingOrganismsAction(Request $request){
        $organisms = $this->container->get(Listing\Organisms::class);
        $result = $organisms->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        return $this->createResponse($result);
    }

    /**
     * Search for traits by name.
     * You can provide a case-insensitive part of the trait name or provide a limit.
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns a list of traits"
     * )
     * @SWG\Parameter(
     *     name="search",
     *     in="query",
     *     type="string",
     *     description="search term, part of the trait name (case insensitive)"
     * )
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     type="integer",
     *     description="max number of traits to return per trait format (so for databases with numerical and categorical traits you might receive twice this number)"
     * )
     * @SWG\Tag(name="Listing")
     *
     * @param Request $request
     * @return Response
     *
     * @Route("/api/listing/traits", name="api_listing_traits", options={"expose"=true}, methods={"GET"})
     */
    public function listingTraitsAction(Request $request){
        $traits = $this->container->get(Listing\Traits::class);
        $result = $traits->execute($request->query->get('limit'), "%".$request->query->get('search')."%");
        return $this->createResponse($result);
    }

    /**
     * Show details of specific trait entries
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns details of trait entries"
     * )
     * @SWG\Parameter(
     *     name="trait_entry_ids[]",
     *     in="query",
     *     type="array",
     *     collectionFormat="multi",
     *     required=true,
     *     items={
     *       "type": "int"
     *     },
     *     description="ids of the trait entries for which details are desired"
     * )
     * @SWG\Parameter(
     *     name="trait_format",
     *     in="query",
     *     type="string",
     *     required=true,
     *     description="trait format, usually one of 'numerical' or 'categorical_free'"
     * )
     * @SWG\Tag(name="Details")
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitEntries", name="api_details_trait_entries", options={"expose"=true}, methods={"GET"})
     */
    public function detailsTraitEntriesAction(Request $request){
        $traitEntries = $this->container->get(Details\TraitEntries::class);
        $result = $traitEntries->execute($request->query->get('trait_entry_ids'), $request->query->get('trait_format'));
        return $this->createResponse($result);
    }

    /**
     * List all of your projects
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns the list of projects of the current user"
     * )
     * @SWG\Parameter(
     *     name="Cookie",
     *     description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *     type="string",
     *     in="header"
     * )
     * @SWG\Tag(name="Listing")
     * @return Response $response
     * @Route("/api/listing/projects", name="api_listing_projects", options={"expose"=true}, methods={"POST"})
     */
    public function listingProjectsAction(){
        $projects = $this->container->get(Listing\Projects::class);
        $user = $this->getFennecUser();
        $result = $projects->execute($user);
        return $this->createResponse($result);
    }

    /**
     * Delete one of your projects
     *
     * @SWG\Response(
     *     response=200,
     *     description="Delete a given project",
     *     examples = {
     *     "application/json": {
     *             "error": null
     *         }
     *     },
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Property(property="error", type="string|null"),
     *     )
     * )
     * @SWG\Parameter(
     *     name="projectId",
     *     description="the id of the project to delete",
     *     type="integer",
     *     in="query"
     * )
     * @SWG\Parameter(
     *     name="attribute",
     *     description="permission status",
     *     type="string",
     *     enum={ "owner", "edit", "view" },
     *     in="query"
     * )
     * @SWG\Parameter(
     *     name="Cookie",
     *     description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *     type="string",
     *     in="header"
     * )
     * @SWG\Tag(name="Projects")
     * @param Request $request
     * @return Response $response
     * @Route("/api/delete/projects", name="api_delete_projects", options={"expose"=true}, methods={"GET"})
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
     * Upload new projects
     *
     * Due to limitation of this documentation frontend 'Try it' does not work here (files not uploaded).
     *
     * @Operation(
     *     consumes={"multipart/form-data"},
     *     tags={"Projects"},
     *     @SWG\Response(
     *         response=200,
     *         description="Returns success status for project upload",
     *         examples={
     *             "application/json": {
     *                 "files": {
     *                     {
     *                         "name": "example.biom",
     *                         "size": 128381,
     *                         "error": null
     *                     }
     *                 }
     *             }
     *         },
     *         @SWG\Schema(
     *             @SWG\Property(
     *                 property="files",
     *                 type="array",
     *                 @SWG\Items(
     *                     @SWG\Property(
     *                         property="name",
     *                         type="string"
     *                     ),
     *                     @SWG\Property(
     *                         property="size",
     *                         type="integer",
     *                     ),
     *                     @SWG\Property(
     *                         property="error",
     *                         type="null|string",
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @SWG\Parameter(
     *         name="Cookie",
     *         description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *         type="string",
     *         in="header"
     *     ),
     *     @SWG\Parameter(
     *         name="files",
     *         description="Files to upload. Send as 'multipart/form-data'.",
     *         in="formData",
     *         required=true,
     *         type="array",
     *         items={
     *             "type"="file"
     *         }
     *     )
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/upload/projects", name="api_upload_projects", options={"expose"=true}, methods={"POST"})
     */
    public function uploadProjectsAction(Request $request){
        $uploadProjects = $this->container->get(Upload\Projects::class);
        $user = $this->getFennecUser();
        $result = $uploadProjects->execute($user);
        return $this->createResponse($result);
    }

    /**
     * Show all traits for a list of organisms
     * @Operation(
     *     consumes={"application/x-www-form-urlencoded"},
     *     produces={"application/json"},
     *     tags={"Details"},
     *     @SWG\Response(
     *         response=200,
     *         description="Returns all traits for a list of organisms"
     *     ),
     *     @SWG\Parameter(
     *         name="fennecIds[]",
     *         in="formData",
     *         type="array",
     *         collectionFormat="multi",
     *         required=true,
     *         items={
     *            "type"="int"
     *         },
     *         description="fennec ids for which traits are desired"
     *     )
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitsOfOrganisms", name="api_details_traits_of_organisms", options={"expose"=true}, methods={"POST"})
     */
    public function detailsTraitsOfOrganismsAction(Request $request){
        $traitDetails = $this->container->get(Details\TraitsOfOrganisms::class);
        $result = $traitDetails->execute($request->request->get('fennecIds'));
        return $this->createResponse($result);
    }

    /**
     * Get trait details for one trait type in a given project
     *
     * @Operation(
     *     consumes={"application/x-www-form-urlencoded"},
     *     produces={"application/json"},
     *     tags={"Details"},
     *     @SWG\Response(
     *         response=200,
     *         description="Returns details of a trait in the context of a project"
     *     ),
     *     @SWG\Parameter(
     *         name="traitTypeId",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="id of the desired trait type"
     *     ),
     *     @SWG\Parameter(
     *         name="projectId",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="id of the project"
     *     ),
     *     @SWG\Parameter(
     *         name="dimension",
     *         in="formData",
     *         type="string",
     *         enum={"rows", "columns"},
     *         required=true,
     *         description="either rows or columns"
     *     ),
     *     @SWG\Parameter(
     *         name="includeCitations",
     *         in="formData",
     *         type="boolean",
     *         default=false,
     *         description="include trait citations in the result"
     *     ),
     *     @SWG\Parameter(
     *         name="Cookie",
     *         description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *         type="string",
     *         in="header"
     *     )
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/details/traitOfProject", name="api_details_trait_of_project", options={"expose"=true}, methods={"POST"})
     */
    public function detailsTraitOfProjectAction(Request $request){
        $traitDetails = $this->container->get(Details\TraitOfProject::class);
        $traitTypeId = $request->request->get('traitTypeId');
        $projectId = $request->request->get('projectId');
        $dimension = $request->request->get('dimension');
        $user = $this->getFennecUser();
        $includeCitations = ($request->request->has('includeCitations')) ? $request->request->get('includeCitations') : false;
        $result = $traitDetails->execute($traitTypeId, $projectId, $dimension, $user, $includeCitations);
        return $this->createResponse($result);
    }

    /**
     * Update a project
     *
     * @Operation(
     *     consumes={"application/x-www-form-urlencoded"},
     *     tags={"Projects"},
     *     @SWG\Response(
     *         response=200,
     *         description="Returns an error object indicating whether the update was successful"
     *     ),
     *     @SWG\Parameter(
     *         name="Cookie",
     *         description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *         type="string",
     *         in="header"
     *     ),
     *     @SWG\Parameter(
     *         name="projectId",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="id of the project"
     *     ),
     *     @SWG\Parameter(
     *         name="biom",
     *         description="json encoded string containing the updated project in biom version 1.0",
     *         in="formData",
     *         required=true,
     *         type="string",
     *     )
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/edit/updateProject", name="api_edit_update_project", options={"expose"=true}, methods={"POST"})
     */
    public function editUpdateProjectAction(Request $request){
        $updateProjects = $this->container->get(Edit\UpdateProject::class);
        $user = $this->getFennecUser();
        $result = $updateProjects->execute($request->request->get('projectId'), $request->request->get('biom'), $user);
        return $this->createResponse($result);
    }

    /**
     * Map database identifiers (e.g. NCBI taxids) to fennec_ids
     *
     * @Operation(
     *     consumes={"application/x-www-form-urlencoded"},
     *     tags={"Mapping"},
     *     @SWG\Response(
     *         response=200,
     *         description="Map a list of identifiers against those stored in fennec to get fennec_ids",
     *         examples={
     *             "application/json":
     *                 {
     *                     "59430": 4757,
     *                     "467843": 4758,
     *                     "1234": null
     *                 }
     *
     *         },
     *         @SWG\Schema(
     *             type="object",
     *             @SWG\Property(property="source_id", type="array<int>|int|null", description="Mapping from source_id to fennec_id")
     *         )
     *     ),
     *     @SWG\Parameter(
     *         name="ids[]",
     *         in="formData",
     *         type="array",
     *         collectionFormat="multi",
     *         items={
     *             "type"="string"
     *         },
     *         required=true,
     *         description="ids from the source database (e.g. eol page_ids, ncbi taxids)"
     *     ),
     *     @SWG\Parameter(
     *         name="db",
     *         description="name of the source database (e.g. EOL, ncbi_taxonomy)",
     *         in="formData",
     *         required=true,
     *         type="string",
     *     )
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/mapping/byDbxrefId", name="api_mapping_byDbxrefId", options={"expose"=true}, methods={"POST"})
     */
    public function mappingByDbxrefIdAction(Request $request){
        $mapping = $this->container->get(Mapping\ByDbxrefId::class);
        $result = $mapping->execute($request->request->get('ids'), $request->request->get('db'));
        return $this->createResponse($result);
    }

    /**
     * Map scientific names to fennec_ids
     *
     * @Operation(
     *     consumes={"application/x-www-form-urlencoded"},
     *     tags={"Mapping"},
     *     @SWG\Response(
     *         response=200,
     *         description="Map a list of scientific names against those stored in fennec to get fennec_ids",
     *         examples={
     *             "application/json":
     *                 {
     *                     "Bellis": 4757,
     *                     "Bellis perennis": 4758,
     *                     "Bla": null
     *                 }
     *
     *         },
     *         @SWG\Schema(
     *             type="object",
     *             @SWG\Property(property="scientific_name", type="array<int>|int|null", description="Mapping from scientific names to fennec_id")
     *         )
     *     ),
     *     @SWG\Parameter(
     *         name="ids[]",
     *         in="formData",
     *         type="array",
     *         collectionFormat="multi",
     *         items={
     *             "type"="string"
     *         },
     *         required=true,
     *         description="scientific names"
     *     ),
     * )
     * @param Request $request
     * @return Response $response
     * @Route("/api/mapping/byOrganismName", name="api_mapping_byOrganismName", options={"expose"=true}, methods={"POST"})
     */
    public function mappingByOrganismNameAction(Request $request){
        $mapping = $this->container->get(Mapping\ByOrganismName::class);
        $result = $mapping->execute($request->request->get('ids'));
        return $this->createResponse($result);
    }


    /**
     * Get scientific names for a list of fennec_ids
     *
     * @SWG\Response(
     *     response=200,
     *     description="List scientific names for fennec_ids"
     * )
     * @SWG\Parameter(
     *     name="ids[]",
     *     in="query",
     *     type="array",
     *     collectionFormat="multi",
     *     items={
     *       "type": "int"
     *     },
     *     description="List of fennec_ids for which the scientific name is desired"
     * )
     * @SWG\Tag(name="Listing")
     * @param Request $request
     * @return Response $response
     * @Route("/api/listing/scinames", name="api_listing_scinames", options={"expose"=true}, methods={"GET"})
     */
    public function listingScinamesAction(Request $request){
        $listingScinames = $this->container->get(Listing\Scinames::class);
        $result = $listingScinames->execute($request->query->get('ids'));
        return $this->createResponse($result);
    }

    /**
     * Share one of your projects with another user
     *
     * @SWG\Response(
     *     response=200,
     *     description="Share a project with another user",
     *     examples = {
     *     "application/json": {
     *             "error": false,
     *             "message": "The permission view was added to user demo successfully."
     *         }
     *     },
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Property(property="error", type="boolean"),
     *         @SWG\Property(property="message", type="string")
     *     )
     * )
     * @SWG\Parameter(
     *     name="projectId",
     *     description="the id of the project to share",
     *     type="integer",
     *     in="path"
     * )
     * @SWG\Parameter(
     *     name="email",
     *     description="email of the fennec user with whom you want to share the project",
     *     type="string",
     *     in="query"
     * )
     * @SWG\Parameter(
     *     name="attribute",
     *     description="the permission you want to grant",
     *     type="string",
     *     enum={ "view", "edit" },
     *     in="query"
     * )
     * @SWG\Parameter(
     *     name="Cookie",
     *     description="Currently you have to set the PHPSESSID cookie until api key authentication is implemented. If you are logged in the web interface you can try it. PHPSESSID=<your-phpsessid>",
     *     type="string",
     *     in="header"
     * )
     * @SWG\Tag(name="Projects")
     * @param Request $request
     * @param $projectId
     * @return Response $response
     * @Security("is_granted('owner', projectId)")
     * @Route("/api/sharing/projects/{projectId}", name="api_sharing_projects", options={"expose"=true}, methods={"GET"})
     */
    public function shareProjectAction($projectId, Request $request){
        $email = $request->query->get('email');
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
