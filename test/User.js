var models = require('../models');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app'); //Used to properly load the app and waterline
var should = chai.should(); //DO NOT REMOVE
var address = "localhost"+":"+config.port;

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {	
    beforeEach((done) => { //Before each test we empty the database
        models.collections.user.destroy({}, function(err) {
		    if(err) return(err);
		    models.collections.group.destroy({}, function(err){
		    	if(err) return(err);
		    	done();
		    })
		});
    });

	//Testing the GET route without data
	describe('/GET /api/users', () => {
	    it('it should GET an empty array', (done) => {
	        chai.request(address)
	            .get('/api/users')
	            .end((err, res) => {
	                res.should.have.status(200);
	                var data = res.body.data;
	                data.should.be.a('array');
	                data.length.should.be.eql(0);
	            done();
	        });
	    });
	});

	//Testing the GET route with data
	describe('/GET /api/users', () => {
	    it('it should GET all the users', (done) => {

	    	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

				var users=[
					{group: model.id, password: "plopplop", name:"plop1", email: "plop@plop.com"},
					{group: model.id, password: "plopplop", name:"plop2", email: "plop2@plop.com"}
				];

		    	models.collections.user.create(users, function(err, response) {
				    if(err) return(err);


				    chai.request(address)
			            .get('/api/users')
			            .end((err, res) => {
			                res.should.have.status(200);
			                var data = res.body.data;
			                data.should.be.a('array');
			                data.length.should.be.eql(2);
			            done();
			        });

				});
			});


	    });
	});

	//Testing the POST route without name
	describe('/POST /api/users', () => {
      	it('it should not POST a user without name fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	email: "plop@plop.com",
	            	password: "plopplop"
	        	};

			   	chai.request(address)
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=error.response.res.body.error;
		               	result.should.have.status(400);
		               	result.should.be.a('object');
		               	result.should.have.property('invalidAttributes');
		               	result.invalidAttributes.should.have.property('name');
		              	done();
		            });
			});
      	});
  	});

	//Testing the POST route without password
	describe('/POST /api/users', () => {
      	it('it should not POST a user without password fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	name: "plop",
	            	email: "plop@plop.com"
	        	};

			   	chai.request(address)
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=error.response.res.body.error;
		               	result.should.have.status(400);
		               	result.should.be.a('object');
		               	result.should.have.property('invalidAttributes');
		               	result.invalidAttributes.should.have.property('password');
		              	done();
		            });
			});
      	});
  	});

	//Testing the POST route without all parameters
	describe('/POST /api/users', () => {
      	it('it should POST a user with all required fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	name: "plop",
	            	email: "plop@plop.com",
	            	password: "plopplop"
	        	};

			   	chai.request(address)
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=response.body.data;
		               	response.should.have.status(200);
		               	result.should.be.a('object');
		               	result.should.have.property('name').eql("plop");
		              	done();
		            });
			});
      	});
  	});

});
