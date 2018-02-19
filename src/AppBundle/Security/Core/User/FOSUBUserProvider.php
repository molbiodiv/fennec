<?php

namespace AppBundle\Security\Core\User;

use AppBundle\Entity\User\FennecUser;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\FOSUBUserProvider as BaseFOSUBProvider;
use Symfony\Component\Security\Core\User\UserInterface;

class FOSUBUserProvider extends BaseFOSUBProvider
{
    public function connect(UserInterface $user, UserResponseInterface $response)
    {
        $property = $this->getProperty($response);
        $username = $response->getUsername();

        // On connect, retrieve the access token and the user id
        $service = $response->getResourceOwner()->getName();

        $setter = 'set' . ucfirst($service);
        $setter_id = $setter . 'Id';
        $setter_token = $setter . 'AccessToken';

        //disconnect previously connected users
        $existingUser = $this->userManager->findUserBy(array($property => $username));
        //set current user id and token null for disconnect
        if(null != $existingUser){
            $existingUser->$setter_id(null);
            $existingUser->$setter_token(null);
            $this->userManager->updateUser($existingUser);
        }
        //connect current user, set user id and token
        $user->$setter_id($username);
        $user->$setter_token($response->getAccessToken());
        $this->userManager->updateUser($user);
    }

    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $userEmail = $response->getEmail();
        $username = $response->getUsername();
        $user = $this->userManager->findUserByEmail($userEmail);
        if($user === null){
            $user = $this->userManager->findUserByUsername($username);
        }

        //if null create new user and set it properties
        if(null === $user){
            $user = new FennecUser();
            $username = $response->getNickname();
            $firstName = $response->getFirstName();
            $lastName = $response->getLastName();
            $user->setUsername($username);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setEmail($userEmail);
            $user->setEnabled(true);
        }
        //else update the access token of existing user
        //get service
        $serviceName = $response->getResourceOwner()->getName();
        $setter = 'set' . ucfirst($serviceName) . 'AccessToken';
        //update access token
        $user->$setter($response->getAccessToken());
        return $user;
    }
}