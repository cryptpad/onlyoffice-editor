import {action, observable, makeObservable} from 'mobx';

export class storeFunctions {
    constructor() {
        makeObservable(this, {
            initFunctions: action,
            functions: observable
        });
    }

    functions = {};

    initFunctions (groups, data, separator) {
        this.functions = this.getFunctions(groups, data, separator);
    }

    getFunctions (groups, data, separator) {
        const functions = {};
        for (let g in groups) {
            const group = groups[g];
            const groupname = group.asc_getGroupName();
            const funcarr = group.asc_getFormulasArray();

            for (let f in funcarr) {
                const func = funcarr[f];
                const _name = func.asc_getName();
                functions[_name] = {
                    type: _name,
                    group: groupname,
                    caption: func.asc_getLocaleName(),
                    args: ((data && data[_name]) ? data[_name].a : '').replace(/[,;]/g, separator),
                    descr: (data && data[_name]) ? data[_name].d : ''
                };
            }
        }
        return functions;
    }
}
