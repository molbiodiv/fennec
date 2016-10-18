<?php
/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 11.10.16
 * Time: 17:34
 */

namespace AppBundle\Controller;


use League\OAuth2\Client\Provider\Github;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends Controller
{
    /**
     * @param Request $request
     * @return Response
     * @Route("/login", name="login")
     */
    public function loginAction(Request $request){
        $provider = new Github([
            'clientId'          => $this->getParameter('github_client_id'),
            'clientSecret'      => $this->getParameter('github_client_secret'),
            'redirectUri'       => $this->getParameter('github_redirect_uri'),
        ]);
        $session = $request->getSession();
        if(!$session->isStarted()){
            $session->start();
        }
        if(!$session->has('user')){
            if (!$request->query->has('code')) {
                // Store referrer for proper redirect after successful login
                $session->set('redirectAfterLogin', filter_input(INPUT_SERVER, 'HTTP_REFERER', FILTER_SANITIZE_STRING));
                // If we don't have an authorization code then get one
                $authUrl = $provider->getAuthorizationUrl();
                $session->set('oauth2state', $provider->getState());
                return $this->redirect($authUrl);

                // Check given state against previously stored one to mitigate CSRF attack
            } elseif (!$request->query->has('state') || ($request->query->get('state') !== $session->get('oauth2state'))) {
                $session->remove('oauth2state');
                exit('Invalid state');
            } else {
                // Try to get an access token (using the authorization code grant)
                $token = $provider->getAccessToken('authorization_code', [
                    'code' => $request->query->get('code')
                ]);

                // Optional: Now you have a token you can look up a users profile data
                try {
                    // We got an access token, let's now get the user's details
                    $user = $provider->getResourceOwner($token);
                    // Use these details to create a new profile
                    $session->set('user', array(
                        'nickname' => $user->getNickName(),
                        'id' => $user->getId(),
                        'provider' => 'github',
                        'token' => $token->getToken()
                    ));
                } catch (Exception $e) {
                    // Failed to get user details
                    exit('Oh dear...');
                }
            }
        }

        // User is now logged in - redirect to previous page if possible (else: index)
        if ($session->has('redirectAfterLogin')) {
            $goal = $session->get('redirectAfterLogin');
            $session->remove('redirectAfterLogin');
            $this->redirect($goal);
        }
        return $this->redirectToRoute('index');
    }

    /**
     * @Route("/logout", name="logout")
     * @param $request Request
     * @return Response
     */
    public function logoutAction(Request $request){
        if($request->hasSession()){
            $request->getSession()->clear();
            $request->getSession()->invalidate();
            return $this->redirect($request->server->get('HTTP_REFERER'));
        }
    }
}