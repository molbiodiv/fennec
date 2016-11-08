<?php

namespace AppBundle\Controller;

use biomcs\BiomCS;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class BiomConversionServerController extends Controller
{
    /**
     * @param $request Request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/biomcs/convert", name="biomcs_convert", options={"expose" = true})
     */
    public function convertAction(Request $request)
    {
        $response = new JsonResponse();
        $response->headers->set('Content-Type', 'application/json');

        $postParameters = $request->request;
        if ($content = $request->getContent()) {
            $parametersAsArray = json_decode($content, true);
            if(json_last_error() == JSON_ERROR_NONE){
                $postParameters = new ParameterBag(array_merge($postParameters->all(), $parametersAsArray));
            }
        }


        if(! $postParameters->has('to') || ! $postParameters->has('content')){
            $response->setData(array(
                'error' => "Missing parameter"
            ));
        } else {
            $to = $postParameters->get('to');
            try{
                $biomcs = new BiomCS();
                $content = base64_decode($postParameters->get('content'));
                $result = '';
                if($to === 'hdf5'){
                    $result = $biomcs->convertToHDF5($content);
                } else {
                    $result = $biomcs->convertToJSON($content);
                }
                $response->setData(array(
                    'content' => base64_encode($result),
                    'error' => null
                ));
            } catch (Exception $e){
                $response->setData(array(
                    'error' => $e->getMessage()
                ));
            }
        }

        return $response;
    }

}
