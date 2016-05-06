/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var util = {
  store: function(namespace, data){
    if( arguments.length > 1)
    {
      return localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      var store = localStorage.getItem(namespace);
      if(store)
      {
        return JSON.parse(store);
      } else {
        return [];
      }
    }
  }
};

var entryID;

function checkstring(inputElem) {
	var regex = new RegExp("^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$");
	var searchText = inputElem;
	console.log(regex.test(searchText));
	if(regex.test(searchText)) return true;
	else return false;
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any ev ents that are required on startup. Common ev ents are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.posts = util.store('posts');
        app.loadTemplates();
        app.render('container', 'entries', {posts: app.posts});
        app.registerCallbacks();
    },
    loadTemplates: function(){
      var templates = ['entries', 'addEntryForm', 'entry', 'editEntryForm' ];

      var templateText = '';

      app.templates = {};

      for(var i=0; i<templates.length; i++)
      {
        var templateText = document.getElementById(templates[i]).text;

        app.templates[templates[i]] = new EJS({text: templateText});
      }
    },
    registerCallbacks: function(){
      $('body').on('click', 'a', function(evt){
        evt.preventDefault();
        history.pushState({}, '', $(this).attr('href'));
        //render stuff
        app.route(location.pathname);
      })
      $("#container").on('click', '#submit', app.addEntry);
      $('#container').on('click', '.delete', app.deleteEntry);
      $('#container').on('click', '.edit', app.editTEntry);
      $('#container').on('click', '#edit2', app.editEntry);
    },
    route: function(path){
      console.log('route'+path);
      if(path === '/add'){
        console.log('inside');
        app.render('container', 'addEntryForm', {});
        return
      }
      if(/\/entries\/(\d*)/.test(path) )
      {
        var id = parseInt(  path.match(/\/entries\/(\d*)/)[1]  );
        app.render('container', 'entry', {post: app.posts[id]});
        return
      }
      app.render('container', 'entries', {posts: app.posts});
    },
    addEntry: function(evt){
      evt.preventDefault();

      var slug = $('#slug').val();
      var body = $('#body').val();

      if(checkstring(slug)){

	      var entry = {slug: slug, body: body};
	      app.posts.push(entry);
	      app.posts.sort(function(a,b){

			var aValues = a.slug.split('/');
			var bValues = b.slug.split('/');
			var aMonth = aValues[0];
			var aDay = aValues[1];
			var aYear = aValues[2];
			var bMonth = bValues[0];
			var bDay = bValues[1];
			var bYear = bValues[2];
			if(aYear!==bYear) return aYear.localeCompare(bYear);
			if(aMonth!==bMonth) return aMonth.localeCompare(bMonth);
			if(aDay!==bDay) return aDay.localeCompare(bDay);
			return a.slug.localeCompare(b.slug);
	      });
	      util.store('posts', app.posts)
	      app.render("container", "entries", {posts: app.posts});

      }

      else{
      	  alert("You need to enter the due date in the format: MM/DD/YYYY!");
      }
    },
    editEntry: function(evt){
      evt.preventDefault();
      app.posts.splice(entryID, 1);
      var slug = $('#editSlug').val();
      var body = $('#editBody').val();

      if(checkstring(slug)){

	      var entry = {slug: slug, body: body};
	      app.posts.push(entry);
	      app.posts.sort(function(a,b){

			var aValues = a.slug.split('/');
			var bValues = b.slug.split('/');
			var aMonth = aValues[0];
			var aDay = aValues[1];
			var aYear = aValues[2];
			var bMonth = bValues[0];
			var bDay = bValues[1];
			var bYear = bValues[2];
			if(aYear!==bYear) return aYear.localeCompare(bYear);
			if(aMonth!==bMonth) return aMonth.localeCompare(bMonth);
			if(aDay!==bDay) return aDay.localeCompare(bDay);
			return a.slug.localeCompare(b.slug);
	      });
	      util.store('posts', app.posts)
	      app.render("container", "entries", {posts: app.posts});

      }

      else{
      	  alert("You need to enter the due date in the format: MM/DD/YYYY!");
      }
    },
    deleteEntry: function(){
      var entryID = $(this).attr('data-id');
      app.posts.splice(entryID, 1);
      util.store('posts', app.posts);

      app.render("container", "entries", {posts: app.posts});
    },
    editTEntry: function(evt){
		evt.preventDefault();

		entryID = $(this).attr('data-id');
		var slug = app.posts[entryID].slug;
		var body = app.posts[entryID].body;
		//app.posts.splice(entryID, 1);
		app.render('container','editEntryForm', {});
		$('#editSlug').val(slug);
		$('#editBody').val(body);
		
    },
    // Update DOM on a Received Event
    render: function(id, template, data) {
      var containerElement = document.getElementById(id);

      var html = app.templates[template].render(data);

      containerElement.innerHTML = html;
    }
};

app.initialize();
