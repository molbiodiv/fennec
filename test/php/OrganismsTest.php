<?php
class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testPushAndPop()
    {
        list($service) = \WebService::factory('listing/Organisms');
        $stack = array();
        $this->assertEquals(0, count($stack));

        array_push($stack, 'foo');
        $this->assertEquals('foo', $stack[count($stack)-1]);
        $this->assertEquals(1, count($stack));

        $this->assertEquals('foo', array_pop($stack));
        $this->assertEquals(0, count($stack));
    }
}
?>