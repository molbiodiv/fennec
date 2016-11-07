<?php

namespace AppBundle\Controller;

use biomcs\BiomCS;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        if(! $request->request->has('to') || ! $request->request->has('content')){
            $response->setData(array(
                'error' => "Missing parameter"
            ));
        } else {
            $to = $request->request->has('to');
            try{
                $biomcs = new BiomCS();
                $content = base64_decode($request->request->get('content'));
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
