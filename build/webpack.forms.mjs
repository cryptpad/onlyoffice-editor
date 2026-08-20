import { editorConfig } from './webpack.editor.factory.mjs';

export default editorConfig('documenteditor', {
    subpath:   'forms',
    lessEntry: 'documenteditor/forms/resources/less/application.less',
});
