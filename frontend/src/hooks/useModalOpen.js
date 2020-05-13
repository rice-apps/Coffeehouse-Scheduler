import React, { useState, useEffect } from 'react';

const useModalOpen = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggle = () => {
        setModalOpen(!modalOpen);
    }

    return [modalOpen, setModalOpen, toggle];
}

export default useModalOpen;