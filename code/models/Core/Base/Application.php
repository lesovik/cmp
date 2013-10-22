<?php

/**
 * Application
 * @author     Les
 */
class Application {
    function  __construct() {
        session_start();
        $this->authenticate();
    }
    public function init() {
        
        try {
            
            $page=Doctrine_Core::getTable('CorePage')->findOneBy('name', INIT_URI);

            if($page) {

                $page->display();
                
            }else {
                $page=Doctrine_Core::getTable('CorePage')->findOneBy('name', ERROR_PAGE);
                $page->display();
            }
        }catch(Exception $e) {
            if(DEBUG) {
                echo $e->getMessage() . ' in: ' . $e->getFile() . '(' . $e->getLine() . ')';
                echo $e->getFile();
				echo $e->getTraceAsString();
            }
        }
    }
    function redirect($page=DEFAULT_PAGE) {
        header("Location: /".$page);
        exit();
    }
    private function authenticate() {
        if(isset($_GET['logout'])){
            session_destroy();
            session_start();
            session_regenerate_id();
            $this->redirect();
        }
        if(!isset ($_SESSION['user_id'])) {
            $_SESSION['user_id']='guest';
            $_SESSION['language_id']=1;
        }
        
    }

}