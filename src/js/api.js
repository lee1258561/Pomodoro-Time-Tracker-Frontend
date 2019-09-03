import React, { Component } from 'react';

class api {

	static domain() {
		var domain = 'http://gazelle.cc.gatech.edu:9103';
		return domain;
	}

	////////////////////////////////////////////////////////
	// Users 
	////////////////////////////////////////////////////////

	static getUsers() {
		var endpoint = '/ptt/users';
		var url = api.domain() + endpoint;
		return fetch(url)
			.then(response => response.json());
	}

	static getSingleUser(id) {
		var endpoint = '/ptt/users/';
		var url = api.domain() + endpoint + id;
		return fetch(url)
			.then(response => response.json());
	}

	static postUser(user) {
		var endpoint = '/ptt/users';
		var url = api.domain() + endpoint;
		return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });

	}

	static putUser(id, user) {
		var endpoint = '/ptt/users/';
		var url = api.domain() + endpoint + id;
		return fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
	}

	static deleteUser(id) {
		var endpoint = '/ptt/users/';
		var url = api.domain() + endpoint + id;
		return fetch(url, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
	}

	////////////////////////////////////////////////////////
	// Projects 
	////////////////////////////////////////////////////////

	static getProjects(userId) {
		var endpoint = '/ptt/users/' + userId + '/projects';
		var url = api.domain() + endpoint;
		return fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json());
	}
	static getSingleProject(userId, projectId) {
		var endpoint = '/ptt/users/' + userId + '/projects/' + projectId;
		var url = api.domain() + endpoint;
		return fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json());

	}

	static postProject(userId, project) {
		var endpoint = '/ptt/users/' + userId + '/projects';
		var url = api.domain() + endpoint;
		return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        });
	}

	static putProject(userId, projectId, project) {
		var endpoint = '/ptt/users/' + userId + '/projects/';
		var url = api.domain() + endpoint + projectId;
		return fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        });
	}

	static deleteProject(userId, projectId) {
		var endpoint = '/ptt/users/' + userId + "/projects/" + projectId;
		var url = api.domain() + endpoint;
		return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
	}

	////////////////////////////////////////////////////////
	// Session
	////////////////////////////////////////////////////////

	static postSession(userId, projectId, session) {
		var endpoint = '/ptt/users/' + userId + '/projects/' + projectId + '/sessions';
		var url = api.domain() + endpoint;
		return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(session),
        });
	}
	static putSession(userId, projectId, sessionId, session) {
		var endpoint = '/ptt/users/' + userId + '/projects/' + projectId + '/sessions/' + sessionId
		var url = api.domain() + endpoint;
		return fetch(url,{
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(session),
        });
	}
	////////////////////////////////////////////////////////
	// Report
	////////////////////////////////////////////////////////
	static getReport(userId, projectId, from, to, includeCount, includeTime) {
		var endpoint = '/ptt/users/' + userId + '/projects/' + projectId + '/report';
		var query = '?from=' + from + '&to=' + to + '&includeCompletedPomodoros=' + includeCount + '&includeTotalHoursWorkedOnProject=' + includeTime;
		var url = api.domain() + endpoint + query;
		return fetch(url)
			.then(response => response.json());
	}
}

export default api;