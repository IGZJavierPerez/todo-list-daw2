(function() {

	var parent = {
		render: render,
		delTodoUI: delTodoUI
	};

	var todosUI = [];

	window.onload = function() {
		render(true);
		applyFilter();

		document.getElementById('new-todo').onkeypress = function(event) {
			if (event.keyCode === 13) {
				addTodo(event.target.value);
				event.target.value = "";
			}
		};

		document.getElementById('clear-completed').onclick = function() {
			delChecked();
		};

		document.getElementById('toggle-all').onclick = function() {
			var state = TODO_APP.itemsLeft() > 0;
			checkAll(state);
		};

		window.onhashchange = applyFilter;
	};

	function addTodo(text) {
	  if(!(text.length == 0))
	  {
            if(/^\s+$/.test(text))
	    {
	        if (key==13){}
	    }
		else
	    {
		    var todoUI = new TODO_APP.TodoUI(text, parent);
		    todosUI.push(todoUI);
		    document.getElementById('todo-list').appendChild(todoUI.container);
		    render(false);
	    }
	  }
	}

	function delTodoUI(todoUI) {
		document.getElementById('todo-list').removeChild(todoUI.container);
		var removed = false,
				i = 0;

		while (!removed && i < todosUI.length) {
			if (todosUI[i] === todoUI) {
				todosUI.splice(i, 1);
				removed = true;
			} else {
				i++;
			}
		}

		render(false);
	}

	function delChecked() {
		TODO_APP.delChecked();
		var toDelete = [];

		todosUI.forEach(function(todoUI) {
			if (todoUI.todo.isDeleted()) {
				toDelete.push(todoUI);
			}
		});

		toDelete.forEach(function(todoUI) {
			delTodoUI(todoUI);
		});

		render(false);
	}


	function checkAll(state) {
		TODO_APP.checkAll(state);
		render(true);
	}

	function applyFilter() {
		var pattern = "#/";
		var pos = window.location.hash.indexOf(pattern);
		var filter = window.location.hash.substring(pos + pattern.length);

		TODO_APP.filterTodos(filter);
		render(true);
		renderLink(filter);
	}

	function render(renderChildren) {
		var itemsLeft = document.getElementById('todo-count');
		var clearCompleted = document.getElementById('clear-completed');
		var mainSection = document.getElementById('main');
		var footer = document.getElementById('footer');


		if (TODO_APP.countTodos() > 0) {
			footer.style.display = '';
			mainSection.style.display = '';
			itemsLeft.innerHTML = '<strong>' + TODO_APP.itemsLeft() + "</strong> item" + (TODO_APP.itemsLeft() !== 1 ? "s" : "") + " left";
		} else {
			mainSection.style.display = 'none';
			footer.style.display = 'none';
		}

		if (TODO_APP.countTodos() - TODO_APP.itemsLeft() > 0) {
			clearCompleted.style.display = '';
			clearCompleted.innerHTML = "Clear completed (" + (TODO_APP.countTodos() - TODO_APP.itemsLeft()) + ")";
		} else {
			clearCompleted.style.display = 'none';
		}

		if (renderChildren) {
			todosUI.forEach(function(todoUI) {
				todoUI.render();
			});
		}
	}

	function renderLink(filter) {
		var links = document.getElementById('filters').getElementsByTagName('a');
		for (var i = 0; i < links.length; i++) {
			links[i].className = '';
		}

		var activeLink = document.getElementById('filter-' + filter) || document.getElementById('filter-all');
		activeLink.className = 'selected';

	}
})();


