<?php

namespace fennecweb\ajax\listing;

use \PDO as PDO;

class Projects extends \fennecweb\WebService
{
    public function execute($querydata)
    {
        $result = array(
                array("This is a Table ID",
                "2016-05-17 10:00:52.627236+00",
                10,
                5
                )
        );
        return $result;
    }
}
