<?php

namespace AppBundle\API\Listing;

use AppBundle\Entity\Data\TraitFileUpload;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Returns information of all users trait files
 */
class TraitFiles
{
    const ERROR_NOT_LOGGED_IN = "Error: You are not logged in.";

    private $data_em;

    /**
     * Projects constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->data_em = $dbversion->getDataEntityManager();
    }


    /**
    * @inheritdoc
    * @returns array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute(FennecUser $user = null)
    {
        $result = array('error' => null, 'data' => array());
        if ($user == null) {
            $result['error'] = Projects::ERROR_NOT_LOGGED_IN;
        } else {
            $traitFiles = $this->data_em->getRepository(TraitFileUpload::class)->findBy(array(
                'fennecUserId' => $user->getId(),
                'deletionDate' => null
            ));
            foreach ($traitFiles as $t) {
                $traitFile = array();
                $traitFile['traitFileId'] = $t->getId();
                $traitFile['filename'] = $t->getFilename();
                $traitFile['importDate'] = $t->getImportDate()->format('Y-m-d H:i:s');
                $traitFile['format'] = '';
                $traitFile['traitType'] = '';
                $traits = $t->getCategoricalTraitEntries();
                if(count($traits) > 0){
                    $traitFile['format'] = 'categorical';
                    $traitFile['traitType'] = $traits[0]->getTraitType();
                } else {
                    $traits = $t->getNumericalTraitEntries();
                    if(count($traits) > 0 ){
                        $traitFile['format'] = 'numerical';
                        $traitFile['traitType'] = $traits[0]->getTraitType();
                    }
                }
                $traitFile['entries'] = count($traits);
                $result['data'][] = $traitFile;
            }
        }
        return $result;
    }
}
