import {PyModule} from '../../robotModels/PyModule';
import {PyFunction} from '../../robotModels/PyFunction';


/**
 * populator for python module file
 */
export class FunctionPopulator
{
    // populate functions into module object
    static populate(lineContentList: string[], module: PyModule): void
    {
        return this.populatePartial()
    }

    // populate only method in className into module object
    static populateClassMethod(lineContentList: string[], module: PyModule,
                           className: string): void
    {
        let classSearchPattern: RegExp = new RegExp(`^class ${className}`);
        let index: number = 0;

        while (index < lineContentList.length) {
            if (lineContentList[index].match(classSearchPattern)) {

            } else {
                continue;
            }
        }
    }

    private static populatePartial(lineContentList: string[], startLine: number, endCondition: Function, module: PyModule): void
    {
        let searchPattern: RegExp = new RegExp(`def (.+):`);
        let index: number = startLine;
        
        while (index < lineContentList.length) {
            let lineContent: string = lineContentList[index];
            let match = lineContent.match(searchPattern);

            if (match) {
                let func: PyFunction = new PyFunction(match[1]);
                let nextLine: number = index + 1;
                index = this.populateDocToFunc(lineContentList, nextLine, func);
                module.functions.push(func);
            } else {
                index++;
            }
        }
    }

    /**
     * populate function document into PyFunction object
     * @param lineContentList the content of python file, split by line
     * @param startLine the line which document beginning
     * @param func target PyFunction object
     * @return when populate complete, indicate the nextline to continue
     */
    static populateDocToFunc(lineContentList: string[], startLine: number,
                             func: PyFunction): number
    {
        return DocumentPopulator.populate(lineContentList, startLine, func);
    }
}


/**
 * populator to populate function document to PyFunction object
 */
class DocumentPopulator
{
    /**
     * populate function document into PyFunction object
     * @param lineContentList the content of python file, split by line
     * @param startLine the line which document beginning
     * @param func target PyFunction object
     * @return when populate complete, indicate the nextline to continue
     */
    static populate(lineContentList: string[], startLine: number,
        func: PyFunction): number
    {

    }
}
