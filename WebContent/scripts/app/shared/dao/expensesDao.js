define(["app/shared/model/Expense", "util/resource", "./userDao", "jquery"], function(Expense, resource, userDao, $) {
	"use strict";
	
	var rc;
	
	rc = resource("api/user/{id}/expenses", {}, {
		fetch: { type:"GET", isArray:true, transformResponse: function(data, headersGetter, allHeadersGetter) {
			if( data == null || !$.isArray(data.payload) ) return;
			for( var i=0; i < data.payload.length; i++ ) {
				data.payload[i] = new Expense(data.payload[i]);
			}
		}},
		add: { type:"POST" }
	});
	
	function fetch(year,month,success,failure) {
		var argsPromise = userDao.getUserData().then(function(userData) {
			return { id: userData.id, year: year, month: month };
		});
		return rc.fetch(argsPromise, resource.findSuccessCallback(arguments), resource.findFailureCallback(arguments));
	}
	
	function add(expense) {
		return rc.add(userDao.getUserData(), expense);
	}
	
	return {
		fetch: fetch,
		add: add
	};
});
