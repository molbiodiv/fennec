<?php

namespace AppBundle\User;

use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthUserProvider;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;

class FennecUserProvider extends OAuthUserProvider
{
    /**
     * {@inheritdoc}
     */
    public function loadUserByUsername($username)
    {
        return new FennecUser($username, $username, 'unknown', null);
    }

    /**
     * @param string $id
     * @param string $username
     * @param string $provider
     * @return FennecUser
     */
    private function loadUser($id, $username, $provider)
    {
        return new FennecUser($id, $username, $provider);
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $id = $response->getUsername();
        $username = $response->getNickname();
        $provider = $response->getResourceOwner()->getName();
        return $this->loadUser($id, $username, $provider);
    }

    /**
     * {@inheritdoc}
     */
    public function refreshUser(UserInterface $user)
    {
        if (!$this->supportsClass(get_class($user))) {
            throw new UnsupportedUserException(sprintf('Unsupported user class "%s"', get_class($user)));
        }
        return $this->loadUser($user->getId(), $user->getUsername(), $user->getProvider());
    }

    /**
     * {@inheritdoc}
     */
    public function supportsClass($class)
    {
        return $class === 'AppBundle\\User\\FennecUser';
    }
}