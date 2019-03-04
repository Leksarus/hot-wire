/* jshint mocha: true */
"use strict";

import chai from "chai";
import dirtyChai from "dirty-chai";

import Resolver from "../../src/Resolver";

chai.use(dirtyChai);

var expect = chai.expect;

describe("hotwire/Resolver", function() {
	describe("~_instantiateService", function(){
		it("instantiates services with classes", function() {
			function Foo(args){ this.foo = true; }

			let r = Object.create(Resolver.prototype);
			let service = r._instantiateService({
					"class": Foo,
					"public": true,
				}, "testCase");

			expect(service).to.be.instanceOf(Foo);
			expect(service.foo).to.be.true();
		});

		it("instantiates services with plain factories", function() {
			let r = Object.create(Resolver.prototype);
			let service = r._instantiateService({
					"factory": function() { return {"foo": true}; },
					"public": true,
				}, "testCase");

			expect(service.foo).to.be.true();
		});

		it("resolves services instantiated with plain factory methods", function() {
			let r = Object.create(Resolver.prototype);
			let service = r._instantiateService({
				"factory": { "makeMeFoo": function() { return {"foo": true}; }},
				"method": "makeMeFoo",
			}, "testCase");

			expect(service.foo).to.be.true();
		});

		it("resolves services provided as plain objects", function() {
			let r = Object.create(Resolver.prototype);
			let service = r._instantiateService({
				"plainObject": {"foo": true},
			}, "testCase");

			expect(service.foo).to.be.true();
		});

		it("throws an exception when finds no way to instantiate service", function() {
			let r = Object.create(Resolver.prototype);

			expect(()=>{
				r._instantiateService({
					"foo": true,
				}, "testCase");
			}).to.throw("Service »testCase«, is invalid: no way to instantiate it.");
		});
	});
});
