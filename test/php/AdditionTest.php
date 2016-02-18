<?php
class AdditionTest extends PHPUnit_Framework_TestCase
{
    public function testAddition()
    {
        $add = new Addition();
        $this->assertEquals(0, $add->add(0,0));
        $this->assertEquals(1, $add->add(0,1));
        $this->assertEquals(1, $add->add(1,0));
        $this->assertEquals(2, $add->add(1,1));
        $this->assertEquals(3, $add->add(1,2));

    }
}
?>