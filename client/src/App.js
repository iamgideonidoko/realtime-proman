import { BryntumGantt } from '@bryntum/gantt-react';
import { ganttConfig } from './GanttConfig';
import './App.scss';

function App() {
    return (
        <BryntumGantt {...ganttConfig} />
    );
}

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/docs/gantt/guide/Gantt/integration/react/data-binding

export default App;
