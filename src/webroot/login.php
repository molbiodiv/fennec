<?php

//config file
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$provider = new League\OAuth2\Client\Provider\Github([
    'clientId'          => GITHUB_CLIENT_ID,
    'clientSecret'      => GITHUB_CLIENT_SECRET,
    'redirectUri'       => GITHUB_REDIRECT_URI,
]);

if (!isset($_SESSION)){
    session_start();
}

if(!isset($_SESSION['user'])){
    if (!isset($_GET['code'])) {

        // If we don't have an authorization code then get one
        $authUrl = $provider->getAuthorizationUrl();
        $_SESSION['oauth2state'] = $provider->getState();
        header('Location: '.$authUrl);
        exit;

    // Check given state against previously stored one to mitigate CSRF attack
    } elseif (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {

        unset($_SESSION['oauth2state']);
        exit('Invalid state');

    } else {

        // Try to get an access token (using the authorization code grant)
        $token = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);

        // Optional: Now you have a token you can look up a users profile data
        try {

            // We got an access token, let's now get the user's details
            $user = $provider->getResourceOwner($token);
            $user['token'] = $token->getToken();

            $_SESSION['user'] = $user;

            // Use these details to create a new profile
            printf('Hello %s!', $user->getNickname());

        } catch (Exception $e) {

            // Failed to get user details
            exit('Oh dear...');
        }
    }
}
