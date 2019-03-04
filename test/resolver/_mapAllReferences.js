/* jshint mocha: true */
"use strict";

import chai from "chai";
import dirtyChai from "dirty-chai";

import Resolver from "../../src/Resolver";

chai.use(dirtyChai);

var expect = chai.expect;

describe("hotwire/Resolver", function() {
	describe("._mapAllReferences", function(){
		it("passes reference to map function", function() {
			var testObject = {
				"foo": {"$ref": "foo"},
			};

			let mapedFunctionVisited = false;

			Resolver._mapAllReferences(testObject, function(ref) {
				expect(ref).to.be.deep.equal({"$ref": "foo"});
				mapedFunctionVisited = true;

				return ref;
			});

			expect(mapedFunctionVisited).to.be.true();
		});

		it("finds all nested references", function() {
			var testObject = {
				"foo": {"$ref": "foo"},
				"spam": {
					"eggs": {"$ref": "eggs"},
					"beans": [{"$ref": "beans"}],
				},
				"bacon": [
					{"$ref": "eggs"},
					{
						"sausage": {"$ref": "sausage"},
					},
				],
			};

			let visited = [];

			Resolver._mapAllReferences(testObject, (ref) => (visited.push(ref.$ref), ref));

			expect(visited.sort()).to.be.deep.equal(["foo", "eggs", "beans", "eggs", "sausage"].sort());
		});

		it("replaces all references with mapped values", function() {
			let testObject = {
				"foo": {"$ref": "foo"},
				"spam": {
					"eggs": {"$ref": "eggs"},
					"beans": [{"$ref": "beans"}],
				},
				"bacon": [
					{"$ref": "eggs"},
					{
						"sausage": {"$ref": "sausage"},
					},
				],
			};
			let validOutput = {
				"foo": "r_foo",
				"spam": {
					"eggs": "r_eggs",
					"beans": ["r_beans"],
				},
				"bacon": [
					"r_eggs",
					{"sausage": "r_sausage"},
				],
			};
			let mapped = Resolver._mapAllReferences(testObject, (ref) => "r_"+ref.$ref);

			expect(mapped).to.be.deep.equal(validOutput);
		});

		it("not modifies original object", function() {
			let testObjectFactory = function() {
				return {
					"foo": {"$ref": "foo"},
					"spam": {
						"eggs": {"$ref": "eggs"},
						"beans": [{"$ref": "beans"}],
					},
					"bacon": [
						{"$ref": "eggs"},
						{
							"sausage": {"$ref": "sausage"},
						},
					],
				};
			};
			let testObject = testObjectFactory();

			Resolver._mapAllReferences(testObject, (ref) => "r_"+ref.$ref);
			expect(testObject).to.be.deep.equal(testObjectFactory());
		});
	});
});
