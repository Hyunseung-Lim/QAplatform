import React from 'react'
import './topbar.css'


export const Topbar = (props) => {
    return(
        <>
            <nav className='topbar'>
                <img className='logo' src="images/Logo.png" alt="Logo" />
                <div className='ask'>
                    Ask
                </div>
                <div>
                    Arxiv
                </div>
            </nav>
        </>
    )
}