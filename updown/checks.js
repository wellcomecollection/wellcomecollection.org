"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var updown_io_1 = require("updown.io");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var expected_checks_1 = __importDefault(require("./expected-checks"));
var utils_1 = require("./utils");
// set region if not set (as not set by the SDK by default)
if (!aws_sdk_1.default.config.region) {
    aws_sdk_1.default.config.update({
        region: 'eu-west-1',
    });
}
var secretsManager = new aws_sdk_1.default.SecretsManager();
var getSecretParams = { SecretId: 'builds/updown_api_key' };
var updownIO;
secretsManager
    .getSecretValue(getSecretParams)
    .promise()
    .then(function (secretData) {
    updownIO = new updown_io_1.UpdownIO(secretData['SecretString']);
    return updownIO.api.checks.getChecks();
})
    .then(function (checkData) {
    var remoteChecks = checkData.map(function (check) { return ({
        url: check.url,
        alias: check.alias,
        period: check.period,
    }); });
    var deletions = (0, utils_1.removeDuplicates)(remoteChecks, expected_checks_1.default);
    var additions = (0, utils_1.removeDuplicates)(expected_checks_1.default, remoteChecks);
    deletions.map(function (check) {
        updownIO.api.checks.deleteCheck(check.url);
    });
    additions.map(function (check) {
        updownIO.api.checks.addCheck(check.url, {
            alias: check.alias,
            period: check.period,
        });
    });
})
    .catch(function (error) {
    console.error(error);
});
