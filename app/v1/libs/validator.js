const Joi = require('joi');
const qs = require('qs');
const _ = require('lodash');

/**
 *
 * @param {string} type
 * @param {object} error
 */
function isErrorWithTypeOf(type, error) {
    return error.details[0].type.indexOf(type) >= 0;
}

/**
 *
 * @param {object} error
 */
function handleError(error) {
    let validationError;
    if (isErrorWithTypeOf('required', error) || isErrorWithTypeOf('empty', error)) {
        validationError = new Error('required');
        validationError.message = error.details[0].message;
    } {
        validationError = new Error('bad request');
    }

    throw validationError;
}

function deleteNullProperties(test, recurse) {
    if (typeof test === 'object' || Array.isArray(test)) {
        for (const i in test) {
            if (test.hasOwnProperty(i)) {
                if (test[i] === null) {
                    delete test[i];
                } else if (recurse) {
                    deleteNullProperties(test[i], recurse);
                }
            }
        }
    }
}

function getValidatedResult(ctx, sources, schema, joiOptions, commonOptions) {
    let params = {};
    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    if (sources.indexOf(Validator.CUSTOM) !== -1) {
        params = schema;
    } else {
        if (sources.indexOf(Validator.BODY) !== -1) {
            Object.assign(params, ctx.request.body);
        }
        if (sources.indexOf(Validator.QUERY) !== -1) {
            Object.assign(params, qs.parse(ctx.querystring));
        }
        if (sources.indexOf(Validator.PATH) !== -1) {
            Object.assign(params, ctx.params);
        }
    }

    if (commonOptions.removeNullProperties) {
        deleteNullProperties(params, true);
    }

    return Joi.validate(params, schema, joiOptions);
}

class Validator {

    static run(ctx, sources, schema, joiOptions = { stripUnknown: true }, commonOptions = { removeNullProperties: true }) {
        const result = getValidatedResult(ctx, sources, schema, joiOptions, commonOptions);
        if (result.error) {
            console.log('Validation error: ', result.error.message);
            handleError(result.error);
        }
        return result.value;
    }

    static get fn() {
        return Joi;
    }

    static array() {
        return Joi.array();
    }

    static boolean() {
        return Joi.boolean();
    }

    static binary() {
        return Joi.binary();
    }

    static date() {
        return Joi.date();
    }

    static number() {
        return Joi.number();
    }

    static alternatives() {
        return Joi.alternatives();
    }

    static object(obj = null) {
        if (obj) {
            return Joi.object(obj);
        } else {
            return Joi.object();
        }
    }

    static string() {
        return Joi.string();
    }

    static any() {
        return Joi.any();
    }

    static optional() {
        return Joi.optional();
    }

    static required() {
        return Joi.required();
    }

}
Validator.PATH = 'path';
Validator.QUERY = 'query';
Validator.BODY = 'body';
Validator.CUSTOM = 'custom';

module.exports = Validator;
