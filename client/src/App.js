import { BryntumGantt } from '@bryntum/gantt-react';
import { ganttConfig } from './GanttConfig';
import './App.scss';
import { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

const socket = io('ws://localhost:5000', { transports: ['websocket'] });

function App() {
    const gantt = useRef(null);
    const changeTimer = useRef();
    const remote = useRef(false);
    const clientId = useRef(uuid());
    const changeTriggered = useRef(false);
    const persistedStore = useRef();

    useEffect(() => {
        const ganttInstance = gantt.current?.instance;
        if (ganttInstance) {
            const project = ganttInstance.project;
            project?.addListener('change', () => {
                if (changeTimer.current) clearTimeout(changeTimer.current);
                changeTimer.current = setTimeout(() => {
                    if (!remote.current) {
                        if (changeTriggered.current) {
                            const store = gantt.current?.instance.store.json
                            socket.emit('data-change', { senderId: clientId.current, store });
                        } else {
                            changeTriggered.current = true;
                        }
                    }
                }, 800)
            });
            project?.addListener('load', () => {
                if (persistedStore.current) {
                    remote.current = true;
                    ganttInstance.store.data = JSON.parse(persistedStore.current);
                    remote.current = false;
                    socket.off('just-joined');
                }
            });
            socket.on('just-joined', ({ _, store }) => {
                persistedStore.current = store
            });

            socket.on('new-data-change', ({ senderId, store }) => {
                if (clientId.current !== senderId) {
                    console.log('new-data-change was triggered => ', JSON.parse(store));
                    remote.current = true;
                    ganttInstance.store.data = JSON.parse(store);
                    remote.current = false;
                }
            });
        }
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <BryntumGantt
            ref = {gantt}
            {...ganttConfig}
        />
    );
}

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/docs/gantt/guide/Gantt/integration/react/data-binding

export default App;
