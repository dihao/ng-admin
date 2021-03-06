/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils');

    var config = {
        name: 'myField',
        type: 'string',
        label: 'My field',
        editable: true,
        order: null,
        identifier: false,
        isDetailLink: false,
        detailLinkRoute: 'edit',
        list: true,
        dashboard: true,
        validation: {
            required: false,
            minlength: 0,
            maxlength: 99999 // We can't remove ng-maxlength directive
        },
        defaultValue: null,
        attributes: {},
        cssClasses: ''
    };

    /**
     * @constructor
     *
     * @param {String } fieldName
     *
     */
    function Field(fieldName) {
        this.config = angular.copy(config);
        this.config.name = fieldName || Math.random().toString(36).substring(7);
        this.config.label = utils.camelCase(this.config.name);
        this.config.isDetailLink = fieldName === 'id';
        this.maps = [];
    }

    Configurable(Field.prototype, config);

    /**
     * Add a map function
     *
     * @param {Function} fn
     *
     * @returns {Field}
     */
    Field.prototype.map = function (fn) {
        if (!arguments.length) return this.maps;
        this.maps.push(fn);

        return this;
    };

    Field.prototype.hasMaps = function () {
        return this.maps.length > 0;
    };

    /**
     * Truncate the value based after applying all maps
     *
     * @param {*} value
     * @param {*} entry
     *
     * @returns {*}
     */
    Field.prototype.getMappedValue = function (value, entry) {
        for (var i in this.maps) {
            value = this.maps[i](value, entry);
        }

        return value;
    };

    Field.prototype.validation = function (obj) {
        if (!arguments.length) {
            // getter
            return this.config.validation;
        }
        // setter
        for (var property in obj) {
            if (!obj.hasOwnProperty(property)) continue;
            if (obj[property] === null) {
                delete this.config.validation[property];
            } else {
                this.config.validation[property] = obj[property];
            }
        }
        return this;
    };

    /**
     * Get CSS classes list based on the `cssClasses` configuration
     *
     * @returns {string}
     */
    Field.prototype.getCssClasses = function (entry) {
        if (this.config.cssClasses.constructor === Array) {
            return this.config.cssClasses.join(' ');
        }
        if (typeof this.config.cssClasses === 'function') {
            return this.config.cssClasses(entry);
        }
        return this.config.cssClasses;
    };

    /**
     * @deprecated use Field.isDetailLink() instead
     */
    Field.prototype.isEditLink = function(bool) {
        console.warn('Field.isEditLink() is deprecated - use Field.isDetailLink() instead');
        if (arguments.length === 0) {
            return this.isDetailLink();
        }
        return this.isDetailLink(bool);
    }

    return Field;
});
