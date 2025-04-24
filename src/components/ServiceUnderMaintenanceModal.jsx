import { useEffect } from 'react';
import ModalWrap from './ModalWrap';

import './ServiceUnderMaintenanceModal.scss';

const ServiceUnderMaintenanceModal = ({ setServiceUnderMaintenanceModal }) => {
    return (
        <ModalWrap title="Service Under Maintenance" onClose={() => setServiceUnderMaintenanceModal(false)} className="preparing">
            <button className="preparing-btn" onClick={() => setServiceUnderMaintenanceModal(false)}>
                OK
            </button>
        </ModalWrap>
    );
};

export default ServiceUnderMaintenanceModal;
