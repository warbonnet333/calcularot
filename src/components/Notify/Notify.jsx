import React from 'react'
import {closeNotifier} from "../../helpers/notify"

const Notify = () => (
    <div onClick={closeNotifier} id="notify_cont">
        <div id="notify_text"></div>
    </div>
)

export default Notify