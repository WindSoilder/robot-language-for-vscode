"use strict";
const vscode_1 = require("vscode");
class RobotDefinitionProvider {
    provideDefinition(document, position, token) {
        // when we wan't to return a thenable object, we can use Promise object
        console.log(position.line);
        console.log(position.character);
        return new Promise((resolve, reject) => {
            let l = new vscode_1.Location(vscode_1.Uri.file("C:\\test.txt"), new vscode_1.Position(0, 3));
            return resolve(l);
        });
        //return commands.executeCommand("extension.sayHello");
    }
}
exports.RobotDefinitionProvider = RobotDefinitionProvider;
//# sourceMappingURL=robotDefinitionProvider.js.map