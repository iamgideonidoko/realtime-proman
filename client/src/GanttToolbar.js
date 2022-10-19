import {
    Toolbar,
    Toast,
} from '@bryntum/gantt';

export default class GanttToolbar extends Toolbar {
    // Factoryable type name
    static get type() {
        return 'gantttoolbar';
    }

    static get $name() {
        return 'GanttToolbar';
    }

    // Called when toolbar is added to the Gantt panel
    set parent(parent) {
        super.parent = parent;

        const me = this;

        me.gantt = parent;

        me.styleNode = document.createElement('style');
        document.head.appendChild(me.styleNode);
    }

    get parent() {
        return super.parent;
    }

    static get configurable() {
        return {
            items: [
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            color    : 'b-green',
                            ref      : 'addTaskButton',
                            icon     : 'b-fa b-fa-plus',
                            text     : 'Create',
                            tooltip  : 'Create new task',
                            onAction : 'up.onAddTaskClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            ref      : 'editTaskButton',
                            icon     : 'b-fa b-fa-pen',
                            text     : 'Edit',
                            tooltip  : 'Edit selected task',
                            onAction : 'up.onEditTaskClick'
                        }
                    ]
                },
            ]
        };
    }

    async onAddTaskClick() {
        const { gantt } = this,
              added     = gantt.taskStore.rootNode.appendChild({
                name     : 'New task',
                duration : 1
            });

        // wait for immediate commit to calculate new task fields
        await gantt.project.commitAsync();

        // scroll to the added task
        await gantt.scrollRowIntoView(added);

        gantt.features.cellEdit.startEditing({
            record : added,
            field  : 'name'
        });
    }

    onEditTaskClick() {
        const { gantt } = this;

        if (gantt.selectedRecord) {
            gantt.editTask(gantt.selectedRecord);
        } else {
            Toast.show('First select the task you want to edit');
        }
    }
}

// Register this widget type with its Factory
GanttToolbar.initClass();
