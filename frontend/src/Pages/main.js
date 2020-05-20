/**
 * Created by Will on 5/11/20.
 */

import React, {Component} from 'react'
import { connect } from 'react-redux';

import Calendar from './Calendar/calendar';
import UserList from './UserList';
import Modal from './Calendar/modal';
import useModalOpen from '../hooks/useModalOpen';
import HeaderBar from './HeaderBar';

const Home = ({ }) => {
    const [modalOpen, setModalOpen, toggle] = useModalOpen();

    return (
        <div style={{ display: "grid", gridTemplateRows: "1fr 12fr" }}>
            <HeaderBar />
            <div style={{ display: "flex" }}>
                <UserList style={{ flexBasis: 1 }} />
                <Calendar />
            </div>
            <div>
                <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </div>
        </div>
    )
}

export default connect(
    (state) => {
        return {
            user: state.auth.user
        }
    }
)(Home)