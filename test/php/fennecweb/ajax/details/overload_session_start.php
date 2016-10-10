<?php

namespace fennecweb\ajax\details;

/**
 * Override session_start() in fennecweb\ajax\details namespace for testing
 * Rather than starting a session it just returns true
 * @return boolean - always true as this is a dummy
 */
function session_start()
{
    return true;
}
