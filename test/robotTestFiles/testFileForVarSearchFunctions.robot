*** Keywords ***
Keyword1
    test function 1    ${testVar1}    ${test Var 2}    ${testVar3}    ${test Var 4}    @{listVar}    &{dictVar}

*** Settings ***
resource    testFileForVarSearchFunctionsResource.robot

*** Variables ***
${testVar1}    varValue1
${test Var 2}    varValue2
@{listVar}    node1    node2    node3