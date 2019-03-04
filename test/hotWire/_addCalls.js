/* jshint mocha: true */
"use strict";

import chai from "chai";
import dirtyChai from "dirty-chai";

import HotWire from "../../src/HotWire";

chai.use(dirtyChai);

var expect = chai.expect;

describe("hotwire/HotWire", function() {
	describe("~_addCalls", function(){
		it("adds calls to services with no calls", function() {
			let hW = new HotWire();
			let factory = () => {};
			let testConfig = {
				"services": {
					"foo": {
						"factory": factory,
					},
				},
				"calls": [
					{"service": "foo", "method": "foo", "arguments": ["foo"]}
				],
			};

			let expectedServices = {
				"foo": {
					"factory": factory,
					"calls": [{"method": "foo", "arguments": ["foo"]}],
				},
			};

			hW._addCalls(testConfig);

			expect(testConfig.services).to.be.deep.equal(expectedServices);
		});

		it("adds calls to services with some calls", function() {
			let hW = new HotWire();
			let factory = () => {};
			let testConfig = {
				"services": {
					"foo": {
						"factory": factory,
						"calls": [{"method": "bar"}],
					},
				},
				"calls": [
					{"service": "foo", "method": "foo", "arguments": ["foo"]}
				],
			};

			let expectedServices = {
				"foo": {
					"factory": factory,
					"calls": [
						{"method": "bar"},
						{"method": "foo", "arguments": ["foo"]},
					],
				},
			};

			hW._addCalls(testConfig);

			expect(testConfig.services).to.be.deep.equal(expectedServices);
		});

		it("adds calls with no arguments to services", function() {
			let hW = new HotWire();
			let factory = () => {};
			let testConfig = {
				"services": {
					"foo": {
						"factory": factory,
					},
				},
				"calls": [
					{"service": "foo", "method": "foo"}
				],
			};

			let expectedServices = {
				"foo": {
					"factory": factory,
					"calls": [{"method": "foo", "arguments": []}],
				},
			};

			hW._addCalls(testConfig);

			expect(testConfig.services).to.be.deep.equal(expectedServices);
		});
	});
});
