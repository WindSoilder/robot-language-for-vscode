*** Settings ***
Resource    finalResource.robot

*** Keywords ***
keyword1
    [arguments]    ${var1}
    test_lib    ${var1}