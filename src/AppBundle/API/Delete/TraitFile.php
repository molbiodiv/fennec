<?php

namespace AppBundle\API\Delete;

use AppBundle\Entity\Data\TraitFileUpload;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Permissions;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Delete TraitFile with given internal_id from the database (user has to be logged in and owner)
 */
class TraitFile
{
    const ERROR_NOT_LOGGED_IN = "Error. You are not logged in.";

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
    */
    public function execute(FennecUser $user = null, $traitFileId)
    {
        $result = array('error' => null, 'success' => null);
        if ($user === null) {
            $result['error'] = TraitFile::ERROR_NOT_LOGGED_IN;
        } else {
            $traitFileEntry = $this->data_em->getRepository(TraitFileUpload::class)->findOneBy(array(
                'fennecUserId' => $user->getId(),
                'id' => $traitFileId
            ));
            if($traitFileEntry === null){
                $result['error'] = "This trait file entry does not exist or does not belong to this user ".$user->getId();
            } else {
                $deletionDate = new \DateTime();
                $traitFileEntry->setDeletionDate($deletionDate);
                foreach($traitFileEntry->getCategoricalTraitEntries() as $entry){
                    $entry->setDeletionDate($deletionDate);
                }
                foreach($traitFileEntry->getNumericalTraitEntries() as $entry){
                    $entry->setDeletionDate($deletionDate);
                }
                $this->data_em->flush();
                $result['success'] = "Deleted trait file with id ".$traitFileId." successfully";
            }
        }
        return $result;
    }
}
