*** Test Cases ***
case1
    ${localVariable} =     Set Variable    30
    ${localVariable} =     return from a func
    using local var keyword    ${localVariable}
case2
    ${localVariable} =     Set Variaible    40
    ${anotherVariable} =    return from a func
    use local var keyword    ${localVariable}
    use another var keyword    ${anotherVariable}

case3
    ${wasSetInVarTable} =    Set Variable    50
    a keyword with argument    ${wasSetInVarTable}
case4
    just a keyword

*** Settings ***
library    test.py

*** Variables ***
${wasSetIsnVarTable}    70