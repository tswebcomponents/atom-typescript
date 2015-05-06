var debug_1 = require("./debug");
var childprocess = require('child_process');
var exec = childprocess.exec;
var spawn = childprocess.spawn;
var workerLib = require('./lib/workerLib');
var atomConfig = require("../main/atom/atomConfig");
var parent = new workerLib.Parent();
var mainPanel = require("../main/atom/views/mainPanelView");
parent.pendingRequestsChanged = function (pending) {
    if (!mainPanel.panelView)
        return;
    mainPanel.panelView.updatePendingRequests(pending);
};
if (debug_1.debugSync) {
    parent.sendToIpc = function (x) { return x; };
    parent.sendToIpcOnlyLast = function (x) { return x; };
}
function startWorker() {
    parent.startWorker(__dirname + '/child.js', showError, atomConfig.typescriptServices ? [atomConfig.typescriptServices] : []);
    console.log('AtomTS worker started');
}
exports.startWorker = startWorker;
function stopWorker() {
    parent.stopWorker();
}
exports.stopWorker = stopWorker;
function showError(error) {
    var message = "Failed to start a child TypeScript worker. Atom-TypeScript is disabled.";
    if (process.platform === "win32") {
        message = message + " Make sure you have 'node' installed and available in your system path.";
    }
    atom.notifications.addError(message, { dismissable: true });
    if (error) {
        console.error('Failed to activate ts-worker:', error);
    }
}
function catchCommonErrors(func) {
    return function (q) { return func(q).catch(function (err) {
        return Promise.reject(err);
    }); };
}
exports.projectService = require('../main/lang/projectService');
exports.echo = catchCommonErrors(parent.sendToIpc(exports.projectService.echo));
exports.quickInfo = catchCommonErrors(parent.sendToIpc(exports.projectService.quickInfo));
exports.build = catchCommonErrors(parent.sendToIpc(exports.projectService.build));
exports.errorsForFileFiltered = catchCommonErrors(parent.sendToIpc(exports.projectService.errorsForFileFiltered));
exports.getCompletionsAtPosition = parent.sendToIpcOnlyLast(exports.projectService.getCompletionsAtPosition, {
    completions: [],
    endsInPunctuation: false
});
exports.emitFile = catchCommonErrors(parent.sendToIpc(exports.projectService.emitFile));
exports.formatDocument = catchCommonErrors(parent.sendToIpc(exports.projectService.formatDocument));
exports.formatDocumentRange = catchCommonErrors(parent.sendToIpc(exports.projectService.formatDocumentRange));
exports.getDefinitionsAtPosition = catchCommonErrors(parent.sendToIpc(exports.projectService.getDefinitionsAtPosition));
exports.updateText = catchCommonErrors(parent.sendToIpc(exports.projectService.updateText));
exports.editText = catchCommonErrors(parent.sendToIpc(exports.projectService.editText));
exports.errorsForFile = catchCommonErrors(parent.sendToIpc(exports.projectService.errorsForFile));
exports.getSignatureHelps = catchCommonErrors(parent.sendToIpc(exports.projectService.getSignatureHelps));
exports.getRenameInfo = catchCommonErrors(parent.sendToIpc(exports.projectService.getRenameInfo));
exports.getRelativePathsInProject = catchCommonErrors(parent.sendToIpc(exports.projectService.getRelativePathsInProject));
exports.debugLanguageServiceHostVersion = parent.sendToIpc(exports.projectService.debugLanguageServiceHostVersion);
exports.getProjectFileDetails = parent.sendToIpc(exports.projectService.getProjectFileDetails);
exports.getNavigationBarItems = parent.sendToIpc(exports.projectService.getNavigationBarItems);
exports.getNavigateToItems = parent.sendToIpc(exports.projectService.getNavigateToItems);
exports.getReferences = parent.sendToIpc(exports.projectService.getReferences);
exports.getAST = parent.sendToIpc(exports.projectService.getAST);
exports.getASTFull = parent.sendToIpc(exports.projectService.getASTFull);
exports.getDependencies = parent.sendToIpc(exports.projectService.getDependencies);
exports.getQuickFixes = parent.sendToIpc(exports.projectService.getQuickFixes);
exports.applyQuickFix = parent.sendToIpc(exports.projectService.applyQuickFix);
exports.getOutput = parent.sendToIpc(exports.projectService.getOutput);
exports.softReset = parent.sendToIpc(exports.projectService.softReset);
exports.getRenameFilesRefactorings = parent.sendToIpc(exports.projectService.getRenameFilesRefactorings);
var queryParent = require('./queryParent');
parent.registerAllFunctionsExportedFromAsResponders(queryParent);
