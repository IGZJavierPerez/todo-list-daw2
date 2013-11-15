(function() {

    var parent = {
        render: render,
        delTodoUI: delTodoUI,
		ordenar: ordenar
    };

    var todosUI = [];

    window.onload = function() {
        render(true);
        applyFilter();
        document.getElementById('new-todo').onkeypress = function(event) {
            if (event.keyCode === 13) {
                var doClean = addTodo(event.target.value);
                if (doClean) {
                    event.target.value = "";
                }
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
        var task = text.trim();
        if (task !== "")
        {
            var todoUI = new TODO_APP.TodoUI(task, parent);
            todosUI.push(todoUI);
            document.getElementById('todo-list').appendChild(todoUI.container);
			ordenar();
            render(false);
            return true;

        }
    }

    function delTodoUI(todoUI) {
        document.getElementById('todo-list').removeChild(todoUI.container);
        var removed = false,
                i = 0;

        while (!removed && i < todosUI.length ) {
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
            clearCompleted.innerHTML = "Clear completed (" + (TODO_APP.countTodos() - TODO_APP.itemsLeft()) + ")";
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
	
	function ordenar() {
		todosUI.sort(ord);
		document.getElementById('todo-list').innerHTML="";
		for (var i = 0; i < TODO_APP.countTodos() ; i++) {
			document.getElementById('todo-list').appendChild(todosUI[i].container);			
        }	
        render(false);		
	}
	function ord(a,b)
	{
		if(!a.todo.getChecked() && b.todo.getChecked()) {
			return -1;
		}
			
		else if(a.todo.getChecked() && !b.todo.getChecked()) {
			return 1;
		}
			
		else if(!a.todo.getChecked() && !b.todo.getChecked()) {
			if(a.todo.getFechaI().getTime()>b.todo.getFechaI().getTime()){
				return -1;
			}
			else{
				return 1;
			}
		}
		else if(a.todo.getChecked() && b.todo.getChecked()) {
			if(a.todo.getFechaF().getTime()>b.todo.getFechaF().getTime()){
				return 1;
			}
			else{
				return -1;
			}
		}
	}
	
})();


