import { BryntumGantt } from '@bryntum/gantt-react';
import { ganttConfig } from './GanttConfig';
import './App.scss';
import { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

const socket = io('ws://localhost:5000', { transports: ['websocket'] });

function App() {
    const 
        ganttRef = useRef(null), // reference to the gantt chart
        remote = useRef(false), // set to true when changes are made to the store
        clientId = useRef(uuid()), // a unique ID for the client
        persistedData = useRef(), // store persisted data from the server
        canSendData = useRef(false); // set to true to allow data to be sent to the server

    useEffect(() => {
        const gantt = ganttRef.current?.instance;
        if (gantt) {
            // access the ProjectModel
            const project = gantt.project;
            // listen for change events
            project?.addListener('change', () => {
                // don't send data when the same client is updating the project store
                if (!remote.current) {
                    // only send data when allowed
                    if (canSendData.current) {
                        // get project store
                        const store = gantt.store.toJSON();
                        // send data to the store with the data-change event
                        socket.emit('data-change', { senderId: clientId.current, store });
                    }
                }
            });
            // trigger when project data is loaded
            project?.addListener('load', () => {
                if (persistedData.current) {
                    const { store } = persistedData.current;
                    remote.current = true;
                    if (store) {
                        // update project store if persisted store exists
                        gantt.store.data = store
                    }
                    remote.current = false;
                    // allow data to be sent 2s after data is loaded
                    setTimeout(() => canSendData.current = true, 2000);
                    // stop listening since this data from this event is needed once
                    socket.off('just-joined');
                }
            });
            socket.on('just-joined', (data) => {
                // update with the persisted data from the server
                if (data) persistedData.current = data;
            });

            socket.on('new-data-change', ({ senderId, store }) => {
                // should not update store if received data was sent by same client
                if (clientId.current !== senderId) {
                    // disable sending sending data to server as change to the stor is to be made
                    remote.current = true;
                    // don't update store if previous data was sent by same client
                    if (JSON.stringify(gantt.store.toJSON()) !== JSON.stringify(store)) {
                        // update store with store from server
                        gantt.store.data = store;
                    }
                    // data can now be sent to the server again
                    remote.current = false;
                }
            });
        }
        return () => {
            // disconnenct socket when this component unmounts
            socket.disconnect();
        };
    }, []);

    return (
        <BryntumGantt
            ref = {ganttRef}
            {...ganttConfig}
        />
    );
}

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/docs/gantt/guide/Gantt/integration/react/data-binding

export default App;
